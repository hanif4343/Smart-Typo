// Track B — Typing Core Engine (v2 — alignment-based diff)
//
// v1 compared typedValue[i] vs targetText[i] positionally. Bug: if the IME
// (e.g. a phonetic/custom Bijoy keyboard) inserts or drops even one
// character, every character after that point gets compared against the
// wrong index and shows as "wrong" — even if the user typed it perfectly.
// One slip made the *entire rest* of the text look wrong.
//
// Fix: align typed text against target text using edit-distance (Wagner–
// Fischer) backtracking, same idea as a text diff. This correctly
// classifies each target character as matched/substituted, and each extra
// typed character as an insertion — without cascading.

const TypingEngine = (function () {
  let targetText = "";
  let startTime = null;
  let lastKeyTime = null;
  let finished = false;

  let correctCount = 0;
  let incorrectCount = 0; // substitutions + insertions
  let backspaceCount = 0;

  let errorMap = {}; // { "target character": occurrences } — for Typing DNA (Track C)
  let keyDelays = [];
  let lastOps = []; // alignment result of the most recent handleInput call
  let currentCombo = 0;
  let maxCombo = 0;

  function reset(text) {
    targetText = text;
    startTime = null;
    lastKeyTime = null;
    finished = false;
    correctCount = 0;
    incorrectCount = 0;
    backspaceCount = 0;
    errorMap = {};
    keyDelays = [];
    lastOps = [];
    currentCombo = 0;
    maxCombo = 0;
  }

  function start(text) {
    reset(text);
  }

  // Wagner–Fischer edit distance with backtrace. n, m are small (single
  // practice snippets), so an O(n*m) table per keystroke is cheap.
  function alignTexts(target, typed) {
    const n = target.length;
    const m = typed.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (target[i - 1] === typed[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const ops = [];
    let i = n, j = m;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && target[i - 1] === typed[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
        ops.push({ type: "match", targetIndex: i - 1, ch: target[i - 1] });
        i--; j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        ops.push({ type: "sub", targetIndex: i - 1, targetCh: target[i - 1], typedCh: typed[j - 1] });
        i--; j--;
      } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        ops.push({ type: "pending", targetIndex: i - 1, ch: target[i - 1] }); // not typed yet
        i--;
      } else {
        ops.push({ type: "insert", ch: typed[j - 1] }); // extra character, no target slot
        j--;
      }
    }
    ops.reverse();
    return ops;
  }

  function handleInput(typedValue, isBackspace) {
    const now = performance.now();
    if (startTime === null) startTime = now;
    if (lastKeyTime !== null) keyDelays.push(now - lastKeyTime);
    lastKeyTime = now;

    if (isBackspace) backspaceCount++;

    const ops = alignTexts(targetText, typedValue);
    lastOps = ops;

    let matches = 0, subs = 0, inserts = 0, pending = 0;
    const localErrorMap = {};

    for (const op of ops) {
      if (op.type === "match") matches++;
      else if (op.type === "sub") {
        subs++;
        localErrorMap[op.targetCh] = (localErrorMap[op.targetCh] || 0) + 1;
      } else if (op.type === "insert") inserts++;
      else if (op.type === "pending") pending++;
    }

    correctCount = matches;
    incorrectCount = subs + inserts;
    errorMap = localErrorMap;

    // Combo = consecutive correct characters right up to the current typing
    // position (skip trailing "pending" — those are just not-typed-yet).
    let idx = ops.length - 1;
    while (idx >= 0 && ops[idx].type === "pending") idx--;
    let combo = 0;
    while (idx >= 0 && ops[idx].type === "match") { combo++; idx--; }
    currentCombo = combo;
    maxCombo = Math.max(maxCombo, currentCombo);

    // Finished when every target character has been reached (matched or
    // substituted) — not just "typed length >= target length", since
    // insertions can inflate typed length before the target is covered.
    finished = pending === 0 && typedValue.length > 0;

    return getLiveStats();
  }

  function getLiveStats() {
    const elapsedMin = startTime ? (performance.now() - startTime) / 60000 : 0;
    const wpm = elapsedMin > 0 ? Math.round((correctCount / 5) / elapsedMin) : 0;
    const totalTyped = correctCount + incorrectCount;
    const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
    return { wpm, accuracy, correctCount, incorrectCount, finished, currentCombo, maxCombo };
  }

  function getResult() {
    const stats = getLiveStats();
    const avgDelay =
      keyDelays.length > 0
        ? Math.round(keyDelays.reduce((a, b) => a + b, 0) / keyDelays.length)
        : 0;

    return {
      ...stats,
      backspaceCount,
      errorMap,
      avgKeyDelayMs: avgDelay,
      targetText,
      timestamp: new Date().toISOString(),
    };
  }

  // Exposes the last alignment so the UI can render correct/incorrect
  // per target character without re-diffing.
  function getLastOps() {
    return lastOps;
  }

  return { start, handleInput, getResult, getLiveStats, getLastOps };
})();

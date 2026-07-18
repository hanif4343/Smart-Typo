// Track B — Typing Core Engine (Phase 1, first version)
//
// Approach: the OS/keyboard IME (Avro/Bijoy/National) already converts
// keypresses into Bangla characters before the browser sees them. So this
// engine compares composed characters against the target text, rather than
// remapping raw keys itself. This keeps it layout-agnostic and simple.
//
// Public API (see bottom): TypingEngine.start(text), .handleInput(value),
// .getResult()

const TypingEngine = (function () {
  let targetText = "";
  let startTime = null;
  let lastKeyTime = null;
  let finished = false;

  let correctCount = 0;
  let incorrectCount = 0;
  let backspaceCount = 0;

  // errorMap: { "character": occurrences } — feeds Typing DNA later (Track C)
  let errorMap = {};
  let keyDelays = []; // ms between consecutive keystrokes, for pace analysis

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
  }

  function start(text) {
    reset(text);
  }

  // Call this on every input event with the current full value of the
  // typed field. Diffs char-by-char against targetText.
  function handleInput(typedValue, isBackspace) {
    const now = performance.now();
    if (startTime === null) startTime = now;
    if (lastKeyTime !== null) keyDelays.push(now - lastKeyTime);
    lastKeyTime = now;

    if (isBackspace) backspaceCount++;

    // Re-score from scratch each time (simple + correct for short texts).
    correctCount = 0;
    incorrectCount = 0;
    const localErrorMap = {};

    const len = Math.min(typedValue.length, targetText.length);
    for (let i = 0; i < len; i++) {
      if (typedValue[i] === targetText[i]) {
        correctCount++;
      } else {
        incorrectCount++;
        const ch = targetText[i];
        localErrorMap[ch] = (localErrorMap[ch] || 0) + 1;
      }
    }
    errorMap = localErrorMap;

    if (typedValue.length >= targetText.length) {
      finished = true;
    }

    return getLiveStats();
  }

  function getLiveStats() {
    const elapsedMin = startTime ? (performance.now() - startTime) / 60000 : 0;
    const wpm = elapsedMin > 0 ? Math.round((correctCount / 5) / elapsedMin) : 0;
    const totalTyped = correctCount + incorrectCount;
    const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
    return { wpm, accuracy, correctCount, incorrectCount, finished };
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

  return { start, handleInput, getResult, getLiveStats };
})();

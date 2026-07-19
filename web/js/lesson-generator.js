// Track C — Lesson generation.
//
// generateLesson() is the one function other pages should call. It always
// resolves to usable practice text: tries AI first (if permitted + key
// present + call succeeds), otherwise falls back to the rule-based
// generator. Never throws.

const LessonGenerator = (function () {
  // --- Rule-based (no AI needed) ---------------------------------------
  // Builds a short practice paragraph that repeats the user's weak
  // characters inside real words pulled from the content bank, so the
  // characters that keep causing errors show up more often than average.

  function ruleBasedLesson(weakChars) {
    if (!weakChars || weakChars.length === 0) {
      return {
        text: getPracticeText("words"),
        reason: "এখনো তেমন কোনো নির্দিষ্ট দুর্বলতা পাওয়া যায়নি — সাধারণ অনুশীলন।",
        source: "rule-based",
      };
    }

    // Pull sentences/words that actually contain at least one weak char.
    const pool = [...CONTENT_BANK.words, ...CONTENT_BANK.sentences];
    const weakSet = new Set(weakChars.map((w) => w.ch));

    const matches = pool.filter((line) =>
      [...line].some((ch) => weakSet.has(ch))
    );

    const text = matches.length > 0
      ? matches.slice(0, 3).join(" ")
      : getPracticeText("words");

    const charList = weakChars.map((w) => w.ch).join(", ");
    return {
      text,
      reason: `তোমার সবচেয়ে বেশি ভুল হওয়া অক্ষর: ${charList} — এই lesson এ সেগুলো বেশি করে আছে।`,
      source: "rule-based",
    };
  }

  // --- AI-enhanced -------------------------------------------------------
  async function aiLesson(weakChars) {
    const charList = weakChars.map((w) => `${w.ch}(${w.count} বার ভুল)`).join(", ");
    const system =
      "তুমি একজন বাংলা টাইপিং শিক্ষক। শুধু বাংলা টেক্সট আউটপুট দেবে, কোনো ব্যাখ্যা ছাড়া — " +
      "শুধু ১টা অনুচ্ছেদ (৩-৫ বাক্য), স্বাভাবিক বাংলা, যেখানে দেওয়া অক্ষরগুলো স্বাভাবিকভাবে বারবার এসেছে।";
    const user = `এই অক্ষর/যুক্তাক্ষরগুলোতে ইউজারের ভুল বেশি হয়: ${charList}। এগুলো ঘন ঘন থাকবে এমন একটা অনুচ্ছেদ লেখো।`;

    const text = await AIClient.generate(system, user);
    return { text, reason: `AI তোমার দুর্বল অক্ষর (${charList}) দেখে এই lesson বানিয়েছে।`, source: "ai" };
  }

  // --- Public entrypoint ---------------------------------------------
  async function generateLesson() {
    const weakChars = SessionStore.getWeakChars(6);

    if (AIClient.isAiEnabled()) {
      try {
        return await aiLesson(weakChars);
      } catch (err) {
        console.warn("AI lesson failed, falling back to rule-based:", err.message);
        window.TBLastAIError = err.message; // surfaced by lesson.html's debug box
      }
    }
    return ruleBasedLesson(weakChars);
  }

  return { generateLesson, ruleBasedLesson };
})();

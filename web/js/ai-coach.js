// Track C — AI Coach: short feedback shown right after a practice session.

const AICoach = (function () {
  function ruleBasedMessage(result) {
    const { wpm, accuracy, errorMap } = result;
    const worst = Object.entries(errorMap || {}).sort((a, b) => b[1] - a[1])[0];

    if (accuracy >= 98) {
      return `চমৎকার! ${accuracy}% accuracy, ${wpm} WPM। এভাবে চালিয়ে যাও।`;
    }
    if (worst) {
      return `ভালো করছো (${wpm} WPM)। "${worst[0]}" অক্ষরে বেশি ভুল হচ্ছে — এটার উপর একটু বেশি নজর দাও।`;
    }
    return `${wpm} WPM, ${accuracy}% accuracy। ধারাবাহিক অনুশীলন চালিয়ে যাও।`;
  }

  async function aiMessage(result) {
    const system =
      "তুমি একজন বন্ধুত্বপূর্ণ বাংলা টাইপিং কোচ। ১-২ বাক্যে, উৎসাহব্যঞ্জক এবং নির্দিষ্ট ফিডব্যাক দাও। " +
      "শুধু বাংলায় লিখবে, কোনো ভূমিকা ছাড়া সরাসরি ফিডব্যাক।";
    const user = `WPM: ${result.wpm}, Accuracy: ${result.accuracy}%, ভুল হওয়া অক্ষর: ${
      Object.keys(result.errorMap || {}).join(", ") || "নেই"
    }`;
    return AIClient.generate(system, user);
  }

  async function getMessage(result) {
    if (AIClient.isAiEnabled()) {
      try {
        return await aiMessage(result);
      } catch (err) {
        console.warn("AI coach failed, falling back:", err.message);
      }
    }
    return ruleBasedMessage(result);
  }

  return { getMessage };
})();

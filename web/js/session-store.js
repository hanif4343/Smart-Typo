// Stores session results locally for now (localStorage). Once Firebase is
// wired up (Track A follow-up), saveSession() should also push to
// Firestore under typingSessions/{uid}/{sessionId} — the shape below is
// already designed to match that later.

const SessionStore = (function () {
  const SESSIONS_KEY = "tb_sessions";
  const WEAKMAP_KEY = "tb_weak_chars";

  function saveSession(result) {
    const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
    sessions.push(result);
    // keep last 200 sessions locally to avoid unbounded growth
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(-200)));

    // merge this session's errorMap into the running weak-character map
    const weak = JSON.parse(localStorage.getItem(WEAKMAP_KEY) || "{}");
    for (const [ch, count] of Object.entries(result.errorMap || {})) {
      weak[ch] = (weak[ch] || 0) + count;
    }
    localStorage.setItem(WEAKMAP_KEY, JSON.stringify(weak));
  }

  function getWeakChars(topN = 5) {
    const weak = JSON.parse(localStorage.getItem(WEAKMAP_KEY) || "{}");
    return Object.entries(weak)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([ch, count]) => ({ ch, count }));
  }

  function getAllSessions() {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
  }

  return { saveSession, getWeakChars, getAllSessions };
})();

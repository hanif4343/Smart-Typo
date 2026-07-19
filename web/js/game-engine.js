// Track D — Game/Gamification Engine (first version).
//
// Placeholder mechanics only for now — no character/enemy art yet (that's
// Track F). This is the data layer: XP, Gold, Level, and reward formulas,
// so the UI has real numbers to show once art is ready.

const GameEngine = (function () {
  const STATE_KEY = "tb_player_state";

  function defaultState() {
    return { totalXp: 0, gold: 0, currentStreak: 0, longestStreak: 0, lastPracticeDate: null };
  }

  function getPlayerState() {
    try {
      return { ...defaultState(), ...JSON.parse(localStorage.getItem(STATE_KEY) || "{}") };
    } catch {
      return defaultState();
    }
  }

  function dateStr(d) {
    return d.toISOString().slice(0, 10);
  }

  // Call once per finished session. Increments streak if this is the first
  // session of a new day and yesterday was also practiced; resets to 1 if
  // there's a gap; no change if already counted today.
  function updateStreak(state) {
    const today = dateStr(new Date());
    if (state.lastPracticeDate === today) return state; // already counted today

    const yesterday = dateStr(new Date(Date.now() - 86400000));
    state.currentStreak = state.lastPracticeDate === yesterday ? (state.currentStreak || 0) + 1 : 1;
    state.longestStreak = Math.max(state.longestStreak || 0, state.currentStreak);
    state.lastPracticeDate = today;
    return state;
  }

  // Simple level curve: 100 XP per level, flat (easy to tune later once
  // real progression pacing is designed).
  function levelFromXp(totalXp) {
    const level = Math.floor(totalXp / 100) + 1;
    const xpIntoLevel = totalXp % 100;
    return { level, xpIntoLevel, xpForNextLevel: 100 };
  }

  // Reward formula: correct characters drive XP, accuracy scales gold
  // (rewards precision, not just speed). Combo streak gives a small bonus
  // on top — rewards sustained accuracy, not just overall accuracy%.
  function computeRewards(result) {
    const xp = Math.max(1, result.correctCount);
    const gold = Math.round((result.correctCount * result.accuracy) / 200); // accuracy is 0-100
    const comboBonusXp = Math.floor((result.maxCombo || 0) / 10) * 5; // +5 XP per 10-combo milestone
    return { xp: xp + comboBonusXp, gold, comboBonusXp };
  }

  function addRewards(xp, gold) {
    let state = getPlayerState();
    const before = levelFromXp(state.totalXp);
    state.totalXp += xp;
    state.gold += gold;
    const streakBefore = state.currentStreak || 0;
    state = updateStreak(state);
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    const after = levelFromXp(state.totalXp);

    // Best-effort Firestore sync — never blocks the UI.
    if (window.TBUser && window.db) {
      window.db.collection("users").doc(window.TBUser.uid)
        .set({ playerState: state }, { merge: true })
        .catch((err) => console.warn("Firestore player-state sync failed:", err.message));
    }

    return {
      state,
      leveledUp: after.level > before.level,
      levelInfo: after,
      streakIncreased: state.currentStreak > streakBefore,
    };
  }

  return { getPlayerState, levelFromXp, computeRewards, addRewards };
})();

// Track A — Authentication.
//
// Single sign-in method for now: Google (simplest on mobile, no password to
// manage). On first sign-in, creates users/{uid} with aiEnabled:false,
// isAdmin:false — matching firestore.rules, which only allows creating a
// doc with those exact starting values (the owner promotes themselves to
// admin later, manually, in the Firebase Console Data tab — see README).
//
// After sign-in resolves, window.TBUser is set to either:
//   null                                    (not signed in)
//   { uid, aiEnabled, isAdmin }             (signed in)
// Other scripts (ai-client.js, session-store.js) read window.TBUser.

const TBAuth = (function () {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  function signOutUser() {
    firebase.auth().signOut();
  }

  async function ensureUserDoc(uid) {
    const ref = db.collection("users").doc(uid);
    const snap = await ref.get();
    if (!snap.exists) {
      const fresh = { aiEnabled: false, isAdmin: false };
      await ref.set(fresh);
      return fresh;
    }
    return snap.data();
  }

  // Registers a callback that fires once on load and again on any auth
  // change, with window.TBUser already populated by the time it's called.
  function onReady(callback) {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docData = await ensureUserDoc(user.uid);
          window.TBUser = { uid: user.uid, name: user.displayName, ...docData };
        } catch (err) {
          console.error("Failed to load/create user doc:", err);
          window.TBUser = null;
        }
      } else {
        window.TBUser = null;
      }
      callback(window.TBUser);
    });
  }

  return { signInWithGoogle, signOutUser, onReady };
})();

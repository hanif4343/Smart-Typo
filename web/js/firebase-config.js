// Firebase web config. These values are public identifiers (not secrets) —
// Firebase project security is enforced via Firestore Security Rules, not by
// hiding this config. Fill in after creating your Firebase project at
// https://console.firebase.google.com

const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE",
};

// Loaded as a plain script for now (Phase 1). Once we add the Firebase SDK
// (via CDN, since there's no bundler yet) this object will be used to
// initialize Auth + Firestore.

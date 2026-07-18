// Firebase web config. These values are public identifiers (not secrets) —
// Firebase project security is enforced via Firestore Security Rules, not by
// hiding this config. Fill in after creating your Firebase project at
// https://console.firebase.google.com

const firebaseConfig = {
  apiKey: "AIzaSyDKjFyMnRnHGHhXPbPMiNRHZstTSIVajSs",
  authDomain: "smart-typer-de3fc.firebaseapp.com",
  projectId: "smart-typer-de3fc",
  storageBucket: "smart-typer-de3fc.firebasestorage.app",
  messagingSenderId: "45089050721",
  appId: "1:45089050721:web:192553d565a916f8631a20",
  measurementId: "G-CPRQ094N9N"
};

// Loaded as a plain script for now (Phase 1). Once we add the Firebase SDK
// (via CDN, since there's no bundler yet) this object will be used to
// initialize Auth + Firestore.


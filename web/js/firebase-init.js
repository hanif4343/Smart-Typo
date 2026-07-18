// Initializes the Firebase app using the config from firebase-config.js.
// Uses the "compat" SDK (loaded via <script> tags in each HTML page) so no
// bundler is needed — fits the phone-only / GitHub Actions workflow.

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
window.db = db;

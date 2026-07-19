# TypeBangla — AI Typing RPG

বাংলা টাইপিং শেখার AI-চালিত গেম। প্রজেক্টের পুরো প্ল্যান ও অবস্থা জানতে **অবশ্যই আগে পড়ো**:
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — কী হয়েছে, কী বাকি
- [`AI_COLLABORATION.md`](AI_COLLABORATION.md) — কোনো AI দিয়ে কাজ করালে এই নিয়ম মানতে হবে
- [`docs/MASTER_PLAN.md`](docs/MASTER_PLAN.md) — বিস্তারিত ফেজ/ট্র্যাক ব্রেকডাউন

## সেটআপ (ফোন থেকে, PC ছাড়া)

1. **GitHub**: এই ফোল্ডারটা GitHub repo হিসেবে push করো (GitHub app বা Codespaces দিয়ে)।
2. **GitHub Pages চালু করা**: repo → Settings → Pages → Source: "GitHub Actions"। প্রতিবার
   `web/` ফোল্ডারে পরিবর্তন push করলে `deploy-pages.yml` workflow সাইট অটো-ডিপ্লয় করবে।
3. **Firebase**: [console.firebase.google.com](https://console.firebase.google.com) এ নতুন প্রজেক্ট
   বানাও (Spark/Free plan — কার্ড লাগবে না), Firestore + Authentication চালু করো। কনফিগ
   `web/js/firebase-config.js` এ বসাও। এরপর Firebase Console → Firestore Database → Rules ট্যাবে
   গিয়ে এই repo-র [`firestore.rules`](firestore.rules) এর কনটেন্ট paste করো — **এটাই আসল সুরক্ষা**,
   `firebase-config.js` এর apiKey না (সেটা public identifier, secret না)।

   > **GitHub secret-scan warning পেলে:** `firebase-config.js` push করলে GitHub একটা heuristic
   > সতর্কতা দিতে পারে ("apiKey" pattern দেখে)। এটা false-positive — নিরাপদে dismiss করা যায়,
   > যদি `firestore.rules` ঠিকমতো apply করা থাকে।
4. **Android build**: `build-android.yml` workflow manually run করলে (Actions ট্যাব →
   "Build Android APK" → "Run workflow") একটা debug APK বানিয়ে দেবে, Artifacts থেকে ডাউনলোড
   করে ফোনে ইনস্টল করবে।
5. **AI Key**: সাইট/অ্যাপ ওপেন করে Settings পেজে নিজের Groq/Mistral key বসাও — এটা শুধু তোমার
   ডিভাইসে থাকে, repo তে কখনো যায় না।

## গুরুত্বপূর্ণ
- Cloud Functions ব্যবহার করা হয়নি ইচ্ছাকৃতভাবে (কার্ড ছাড়া চলে না) — AI কল সরাসরি client থেকে হয়।
- এখনো এটা শুধু **কাঠামো (Phase 1 এর শুরু)** — Typing Engine, AI System, Game System এখনো বসানো হয়নি।

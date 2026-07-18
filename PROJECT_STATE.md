# TypeBangla — Project State

> **নিয়ম:** যেকোনো AI (Claude/Gemini/ChatGPT/DeepSeek/other) এই রিপোতে কাজ করার আগে এই ফাইলটা পুরো পড়বে,
> এবং কাজ শেষে **অবশ্যই** এই ফাইল আপডেট করে যাবে — নতুন কী হলো, কী বাকি, কোনো সিদ্ধান্ত বদলালো কিনা।
> বিস্তারিত নিয়ম `AI_COLLABORATION.md` এ।

---

## ১. মূল ভিশন (এক নজরে)

বাংলা টাইপিং শেখার AI-চালিত RPG গেম। ইউজার টাইপ করে ক্যারেক্টার লেভেল-আপ করবে, দৈত্য/বস হারাবে,
আর AI তার ভুল অক্ষর/যুক্তাক্ষর ট্র্যাক করে প্রতিদিন নতুন lesson বানাবে। Web (GitHub Pages) + Android
(Capacitor, GitHub Actions build) — একই কোডবেস।

পূর্ণ ভিশন ও ফিচার তালিকা: `docs/FULL_VISION.md` দেখো (মূল ১০-বছরের আইডিয়া, কিছুই বাদ যায়নি,
শুধু priority অনুযায়ী ধাপে ভাগ করা)।

## ২. এখনকার স্কোপ (Active Scope)

- ✅ চালু রাখা: Web + Android, Typing Engine, AI System (Grok/Cerebras client-side), পূর্ণ Gamification
- ⏸️ পরে করা হবে (কাঠামোয় জায়গা আছে, বিল্ড করা হয়নি): School Mode, Company Mode, Certification,
  Marketplace, Premium/Payments

## ৩. গুরুত্বপূর্ণ টেকনিক্যাল সিদ্ধান্ত (বদলানো যাবে না বিনা আলোচনায়)

- **কোনো Cloud Functions না** — কার্ড/billing নেই বলে Firebase Spark (free) plan এ Functions চলে না।
  AI API কল হবে **সরাসরি client থেকে**, key ইউজার নিজে app-এ বসাবে (device local storage এ, repo তে না)।
- Database: Firebase Firestore + Auth (free tier)
- Web hosting: GitHub Pages (static)
- Android: Capacitor wraps the same web app → GitHub Actions builds APK
- `aiEnabled` পারমিশন Firestore ফিল্ড দিয়ে নিয়ন্ত্রিত, admin (owner) নিজে টগল করে — client-side enforced
  (কড়া সার্ভার-সাইড সিকিউরিটি এখনো নেই, ইউজার সংখ্যা কম বলে গ্রহণযোগ্য)
- Mobile-first UI, সাইটে desktop/mobile toggle থাকবে

## ৪. Track ভিত্তিক অগ্রগতি

| Track | অবস্থা | নোট |
|---|---|---|
| A. Infra & DevOps | 🟡 শুরু হয়েছে | starter repo structure, workflows তৈরি হয়েছে; Firebase project এখনো তৈরি করা হয়নি |
| B. Typing Core Engine | 🟡 প্রথম ভার্সন কাজ করছে | `practice.html` — letters/conjuncts/words/sentences মোড, live WPM/accuracy, per-char error tracking। সেশন এখন localStorage এ সেভ হয় (Firestore যোগ হয়নি এখনো) |
| C. AI System | 🟡 প্রথম ভার্সন কাজ করছে | rule-based lesson (সবসময় কাজ করে) + AI-enhanced lesson/coach (permission-gated, client-side Grok/Cerebras call, ব্যর্থ হলে নিঃশব্দে rule-based এ fallback করে) |
| D. Game/Gamification Engine | ⬜ শুরু হয়নি | |
| E. Content (বাংলা) | 🟡 ছোট শুরু | `data/content-bank.js` এ letters/conjuncts/words/sentences এর ছোট পুল আছে, বাড়ানো দরকার |
| F. Art & Character Design | ⬜ শুরু হয়নি | style এখনো ঠিক হয়নি (pixel/anime/3D?) |

## ৫. এখন যা করা হয়েছে (Changelog)

- **2026-07-18**: Repo skeleton তৈরি (folder structure, GitHub Actions workflow files, PROJECT_STATE.md,
  AI_COLLABORATION.md)। কোনো actual feature code এখনো লেখা হয়নি।
- **2026-07-18**: Track B প্রথম ভার্সন — `web/practice.html`, `web/js/typing-engine.js`,
  `web/js/session-store.js`, `web/data/content-bank.js`। **সিদ্ধান্ত:** Avro/Bijoy/National
  আলাদা key-map বানানো হয়নি — OS/IME নিজেই Bangla-তে কনভার্ট করে, engine শুধু composed characters
  compare করে (layout-agnostic)। এতে "কোন আঙুল দুর্বল" ফিচারটা এখনই সম্ভব না, নিচে open question এ আছে।
- **2026-07-18**: Track C প্রথম ভার্সন — `web/js/ai-client.js` (Grok/Cerebras direct client call,
  OpenAI-compatible), `web/js/lesson-generator.js` (rule-based always works + AI-enhanced),
  `web/js/ai-coach.js`, `web/lesson.html`। `settings.html` এ AI on/off toggle (এখনকার "পারমিশন" —
  পরে Firestore per-user flag হবে)। **⚠️ যাচাই করা হয়নি এখনো:** ব্রাউজার থেকে সরাসরি x.ai/cerebras.ai
  কল করলে CORS ব্লক করতে পারে (এই দুই API মূলত সার্ভার-সাইড ব্যবহারের জন্য বানানো)। কোড সেটার জন্য
  gracefully rule-based এ fallback করে, কিন্তু owner-কে সত্যিকার device এ টেস্ট করে দেখতে হবে AI অংশ
  আদৌ কল হচ্ছে কিনা।

## ৬. পরবর্তী কাজ (Next Up)

1. **Owner action দরকার:** `lesson.html`/Settings এ AI চালু করে সত্যিই test করা — CORS ব্লক করলে
   বিকল্প নিয়ে আলোচনা করতে হবে (Capacitor native HTTP plugin, বা অন্য কিছু)
2. Firebase প্রজেক্ট বানানো (owner করবে, phone থেকে console.firebase.google.com) + Firestore SDK
   `web/` এ যোগ করে session data localStorage থেকে Firestore এ move করা
3. Track D: Gamification (XP/Gold/Level/Combat) শুরু করা — এখন শুধু typing metrics আছে, game state নেই
4. Track E: content bank আরও বড় করা (এখন খুবই ছোট, ৪-৫টা করে আইটেম আছে প্রতি level এ)
5. Track F: Character/art style সিদ্ধান্ত

## ৭. খোলা প্রশ্ন (Owner-কে জিজ্ঞাসা করার মতো, কোনো AI নিজে ধরে নেবে না)

- Character/art style: pixel-art / anime / low-poly 3D?
- Web framework: Vanilla JS নাকি React?
- Grok vs Cerebras — কোনটা lesson-gen এ primary, কোনটা fallback?
- "কোন আঙুল দুর্বল" ফিচার (Typing DNA-র অংশ) IME-based typing এ সরাসরি করা যায় না (raw keycode
  পাওয়া যায় না phonetic layout এ)। বাদ দেওয়া হবে, নাকি raw-keydown ক্যাপচার করে best-effort
  heuristic বানানো হবে (Bijoy/fixed layout এ সহজ, Avro phonetic এ অনির্ভরযোগ্য)?

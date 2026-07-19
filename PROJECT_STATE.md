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

- ✅ চালু রাখা: Web + Android, Typing Engine, AI System (Groq/Mistral client-side), পূর্ণ Gamification
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
| A. Infra & DevOps | 🟡 এগোচ্ছে | starter repo + workflows আছে; Firebase project তৈরি হয়েছে ও config বসানো হয়েছে; Auth (Google sign-in) + Firestore integration কোড লেখা হয়েছে, owner-এর একটা কাজ বাকি (নিচে দেখো) |
| B. Typing Core Engine | 🟡 প্রথম ভার্সন কাজ করছে | `practice.html` — letters/conjuncts/words/sentences মোড, live WPM/accuracy, per-char error tracking। সেশন এখন localStorage সবসময় + সাইন-ইন থাকলে Firestore এও সিঙ্ক হয় |
| C. AI System | 🟡 প্রথম ভার্সন কাজ করছে | rule-based lesson + AI-enhanced lesson/coach। **permission gate এখন সত্যিকার Firestore-backed** (`users/{uid}.aiEnabled`) — সাইন-ইন ছাড়া AI সবসময় বন্ধ থাকবে, `settings.html` এর local toggle সরিয়ে ফেলা হয়েছে |
| D. Game/Gamification Engine | 🟡 আরও এগোলো | `game-engine.js` — XP/Gold/Level, daily streak, combo bonus XP। `typing-engine.js` এ combo tracking (consecutive correct chars) যোগ হয়েছে। `data/enemies.js` এ ৪টা placeholder enemy (emoji), প্রতি রাউন্ডে random rotate করে। `practice.html` এ combo badge (🔥×N) দেখায় ৫+ combo হলে |
| E. Content (বাংলা) | 🟡 বড় হয়েছে | `data/content-bank.js` — প্রতি level এ এখন ৪-১২টা আইটেম (আগে ছিল ২-৫টা), conjuncts double হয়েছে |
| F. Art & Character Design | 🟡 শুরু হয়েছে | **সিদ্ধান্ত:** style = pixel-art, owner নিজে হাতে আঁকবে (AI/CC0 asset না)। `docs/PIXEL_ART_GUIDE.md` এ সম্পূর্ণ ধাপে-ধাপে গাইড লেখা হয়েছে (Piskel টুল, 32×32 canvas, palette→silhouette→shading→outline→detail→animation)। এখনো কোনো actual sprite ফাইল আসেনি — owner কাজ করছে |

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

- **2026-07-19**: `firestore.rules` যোগ হলো — real security boundary, `firebase-config.js` এর
  apiKey কে GitHub secret-scanner ভুলভাবে "leaked secret" মনে করতে পারে, সেটা false-positive
  (rules ঠিক থাকলে নিরাপদ, README-তে ব্যাখ্যা আছে)।
- **2026-07-19**: Auth যোগ হলো — `web/js/firebase-init.js`, `web/js/auth.js` (Google sign-in,
  `signInWithRedirect` ব্যবহার করা হয়েছে, popup না, কারণ mobile browser এ popup ব্লক হতে পারে)।
  প্রথম সাইন-ইনে `users/{uid}` doc বানায় `aiEnabled:false, isAdmin:false` দিয়ে। `index.html` এ
  sign-in/sign-out UI। `ai-client.js`-এর `isAiEnabled()` এখন `window.TBUser.aiEnabled` চেক করে
  (local toggle বাদ)। `session-store.js` এখন সাইন-ইন থাকলে Firestore এও session push করে
  (best-effort, fail করলে silently শুধু local এ থাকে)।
- **2026-07-19**: 🐛 **Bug reported:** owner এর ফোনে "Google দিয়ে Sign in করো" বাটনে ক্লিক করলে কিছুই
  হচ্ছে না। DevTools ফোনে নেই বলে root cause এখনো নিশ্চিত না। **Fix (debug tooling):**
  `index.html` এ visible on-page debug box যোগ করা হয়েছে — কোনো script error বা sign-in error
  হলে এখন লাল বক্সে দেখাবে (আগে শুধু console এ যেত, যেটা phone থেকে দেখা যায় না)। `auth.js` এর
  `signInWithGoogle()` এখন promise return করে যাতে caller error catch করতে পারে। **সন্দেহভাজন
  কারণ:** owner এখনো Authentication → Sign-in method ট্যাবে গিয়ে Google provider enable করেছে
  কিনা কনফার্ম হয়নি (শুধু Settings/Authorized domains ট্যাব screenshot এসেছে)।

- **2026-07-19**: 🐛 **Bug fixed:** owner রিপোর্ট করলো একটা ভুল টাইপ (IME থেকে অতিরিক্ত অক্ষর ঢুকে
  যাওয়া, যেমন "আমি" এর জায়গায় "আমিম") হলে বাকি পুরো টেক্সট ভুল দেখাচ্ছিল এবং accuracy অস্বাভাবিক
  কমে যাচ্ছিল (স্ক্রিনশটে 25%)। **কারণ:** v1 engine positional index দিয়ে compare করতো
  (`typed[i]` vs `target[i]`) — একটা insertion/deletion হলেই বাকি সব index শিফট হয়ে cascading
  ভুল দেখাতো। **Fix:** `web/js/typing-engine.js` এখন Wagner–Fischer edit-distance alignment
  ব্যবহার করে (match/substitution/insertion/pending classify করে), তাই একটা ভুলে বাকি সঠিক
  টাইপিং আর ভুল দেখাবে না। `practice.html` এর rendering ও নতুন alignment থেকে আঁকে
  (`TypingEngine.getLastOps()`)। "finished" detection ও এই সাথে ঠিক হলো (আগে insertion এর
  কারণে সময়ের আগেই "শেষ" হয়ে যেতে পারতো)।
- **2026-07-19**: sign-in bug resolved — নতুন API key কিছুক্ষণ propagate হতে সময় নিয়েছিল
  (Google Cloud এ key তৈরি হওয়ার পরের সাধারণ delay), key restriction সমস্যা ছিল না। কোনো কোড
  পরিবর্তন লাগেনি।
- **2026-07-19**: Track D প্রথম ভার্সন — `web/js/game-engine.js` (XP/Gold/Level, flat 100XP/level
  curve — pacing এখনো tune করা হয়নি, খেলে দেখে feedback দরকার)। `practice.html` এ placeholder
  emoji enemy (👹→💀) HP bar, `index.html` এ quick player summary। **এখনো নেই:** কোনো real
  character/enemy art (Track F), inventory, combo/skill system, daily streak — এগুলো পরের ধাপ।

- **2026-07-19**: Track D: daily streak যোগ হলো (`updateStreak()`, `currentStreak`,
  `longestStreak`, `lastPracticeDate`) — দিনে প্রথম সেশন শেষ হলে গণনা হয়, gap হলে reset হয়ে যায়।
  Track E: content bank বড় করা হলো — letters ৪→৬, conjuncts ২→৪, words ৩→৮, sentences ৫→১২ সেট।

- **2026-07-19**: Track F সিদ্ধান্ত: pixel-art style, owner নিজে আঁকবে (Piskel tool দিয়ে)।
  `docs/PIXEL_ART_GUIDE.md` লেখা হয়েছে — সম্পূর্ণ workflow (silhouette → base color → shading
  → outline → detail → animation)। শুরু করবে Slime দিয়ে (সহজ), তারপর Hero। PNG export করে
  দিলে code integration করা হবে।

- **2026-07-19**: owner-এর art কাজ চলাকালীন, স্বাধীনভাবে করা কাজ: (1) **Combo system** —
  `typing-engine.js` এ consecutive-correct-char tracking (`currentCombo`, `maxCombo`), 5+ combo
  হলে `practice.html` এ 🔥×N badge দেখায়, session শেষে +5 XP প্রতি ১০-combo milestone এ bonus।
  (2) **Enemy rotation** — `data/enemies.js` এ ৪টা placeholder enemy, প্রতি রাউন্ডে random বাছাই
  (real sprite এলে emoji-কে সহজে path দিয়ে swap করা যাবে)। (3) **Debug visibility সব পেজে** —
  `lesson.html`-এ এখন badge সত্যিকারভাবে বলে AI চলেছে নাকি fallback হয়েছে, আর কেন (exact error
  message), `practice.html`-এও `index.html`-এর মতো visible debug box যোগ হলো — AI live test করার
  সময় নিজে থেকেই দেখতে পারবে কী হচ্ছে, আমাকে স্ক্রিনশট পাঠানো নাও লাগতে পারে।

- **2026-07-19**: 🐛 **Correction:** owner-এর আসলে Grok/Cerebras না, **Groq** আর **Mistral** API
  আছে (Grok = xAI, Groq = আলাদা fast-inference কোম্পানি — নাম প্রায় একই কিন্তু ভিন্ন প্রোভাইডার)।
  `ai-client.js` আপডেট হলো: Groq (`api.groq.com/openai/v1`, model `llama-3.3-70b-versatile`) ও
  Mistral (`api.mistral.ai/v1`, model `mistral-small-latest`)। `settings.html` dropdown ও আপডেট
  হয়েছে। localStorage key naming pattern অপরিবর্তিত (`tb_ai_key_<provider>`), তাই পুরনো
  grok/cerebras key থাকলে সেগুলো অকেজো — নতুন provider সিলেক্ট করে নতুন key বসাতে হবে।

- **2026-07-19**: Cerebras আবার যোগ হলো — owner-এর আসলে ৩টা provider আছে (Groq, Mistral,
  Cerebras)। `ai-client.js` এ `callCerebras()` ফিরিয়ে আনা হলো (`api.cerebras.ai/v1`, model
  `llama3.1-70b`), `settings.html` dropdown এ ৩টা option এখন।

## ৬. পরবর্তী কাজ (Next Up)

1. **Owner কাজ করছে:** Piskel-এ Slime এনিমি আঁকা
2. **Owner action (এখন সহজ):** `lesson.html`-এ গিয়ে AI চালু অবস্থায় দেখো badge কী বলে —
   "✅ AI Lesson" মানে কাজ করছে, "⚠️ fallback" মানে CORS/key সমস্যা (exact error box-এ দেখাবে)
3. Track D বাকি: skill/ultimate move (combo threshold পার হলে বিশেষ attack visual)
4. Track B: layout-এর "কোন আঙুল দুর্বল" প্রশ্নটা (open question হিসেবে আগেই আছে) এখনো সিদ্ধান্ত হয়নি

## ৭. খোলা প্রশ্ন (Owner-কে জিজ্ঞাসা করার মতো, কোনো AI নিজে ধরে নেবে না)

- Web framework: Vanilla JS নাকি React?
- Groq vs Mistral — কোনটা lesson-gen আর কোনটা coach-message এর জন্য primary রাখবে (এখন default:
  lesson-gen ও coach দুটোই active provider ব্যবহার করে, `settings.html` থেকে বেছে নেওয়া যায়)
- "কোন আঙুল দুর্বল" ফিচার (Typing DNA-র অংশ) IME-based typing এ সরাসরি করা যায় না (raw keycode
  পাওয়া যায় না phonetic layout এ)। বাদ দেওয়া হবে, নাকি raw-keydown ক্যাপচার করে best-effort
  heuristic বানানো হবে (Bijoy/fixed layout এ সহজ, Avro phonetic এ অনির্ভরযোগ্য)?

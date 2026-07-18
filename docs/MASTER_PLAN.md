# TypeBangla: AI Typing RPG — মাস্টার প্ল্যান

**স্কোপ কনফার্ম:** Web (GitHub Pages) + Android (Capacitor + GitHub Actions) + Firebase (DB/Auth/Functions) + AI (Grok/Cerebras, admin-permission gated) + পূর্ণাঙ্গ Gamification/AI System।
School/Company/Certification/Marketplace/Premium — পরের ধাপ, এখন শুধু কাঠামো রাখা হবে যেন ভবিষ্যতে যোগ করা সহজ হয়।

---

## ০. মূলনীতি (সবকিছুর ভিত্তি)

1. **Single source of truth**: একটাই Firestore schema, ওয়েব আর অ্যাপ দুটোই একই backend/Functions ব্যবহার করবে।
2. **AI cost control**: প্রতিটা AI কল Cloud Function এর ভেতর দিয়ে যাবে, key কখনো ক্লায়েন্টে থাকবে না, এবং `aiEnabled` flag ছাড়া AI চলবে না (rule-based fallback থাকবে)।
3. **Character/Art কে ছোট করে দেখা হবে না** — এটা আলাদা track হিসেবে চলবে, প্রোগ্রামিং-এর প্যারালালে, প্রথম রিলিজেই যেন "সাদামাটা placeholder" ফীল না হয়।
4. **প্রতিটা ধাপ নিজে থেকে চলার মতো (playable) হবে** — অর্থাৎ Phase 1 শেষেই একটা সম্পূর্ণ ছোট খেলাযোগ্য জিনিস থাকবে, অর্ধেক ফিচার নয়।

---

## ১. কাজের বিভাগ (Tracks)

কাজ ৬টা সমান্তরাল ট্র্যাকে ভাগ — প্রতিটার নিজস্ব চেকলিস্ট আছে নিচে।

| Track | কী আছে | 
|---|---|
| A. Infra & DevOps | GitHub Actions, Firebase setup, Capacitor build, hosting |
| B. Typing Core Engine | Layout, keystroke capture, WPM/accuracy, error detection |
| C. AI System | Typing DNA, weak-key detection, adaptive lesson gen, AI coach, permission gate |
| D. Game/Gamification Engine | Character, combat, enemy, XP/economy, theme, sound |
| E. Content | Lesson library, story text, word/sentence bank (বাংলা কনটেন্ট) |
| F. Art & Character Design | ক্যারেক্টার ডিজাইন, animation, enemy sprite, UI theme — সময়সাপেক্ষ, আলাদা |

---

## ২. Track A — Infra & DevOps

- [ ] GitHub repo তৈরি (mono-repo: `/web`, `/functions`, `/android` capacitor wrapper)
- [ ] Firebase প্রজেক্ট তৈরি — Firestore + Auth (Email বা Google login) + Cloud Functions + Hosting (backup, মূল হোস্ট GitHub Pages)
- [ ] Firestore security rules: নিজের ডেটা ছাড়া কেউ কারো ডেটা পড়তে/লিখতে পারবে না; `aiEnabled`/`isAdmin` ফিল্ড শুধু admin (তুমি) থেকে পরিবর্তনযোগ্য (Cloud Function দিয়ে, ক্লায়েন্ট থেকে না)
- [ ] GitHub Actions workflow #1: push হলে web build → GitHub Pages এ deploy
- [ ] GitHub Actions workflow #2: Capacitor sync → Android Gradle build → APK artifact/Release আপলোড
- [ ] GitHub Secrets এ Firebase config + Grok/Cerebras key (শুধু Functions deploy এর জন্য, ক্লায়েন্ট বান্ডেলে নয়)
- [ ] Cloud Functions স্ট্রাকচার: `generateLesson`, `aiCoachMessage`, `analyzeTypingSession`, `setAiPermission` (admin-only)

---

## ৩. Track B — Typing Core Engine

- [ ] Layout সাপোর্ট: Avro, Bijoy, National (key-map টেবিল)
- [ ] Keystroke event capture — প্রতিটা key-এর timestamp, key-to-key delay, backspace count
- [ ] WPM, Accuracy, Error rate রিয়েল-টাইম হিসাব
- [ ] Error classification: অক্ষর ভুল / যুক্তাক্ষর ভুল / কার ভুল / শব্দ ভুল (ফোনেটিক গ্রুপ অনুযায়ী)
- [ ] Session ডেটা Firestore এ সেভ (`typingSessions/{uid}/{sessionId}`)
- [ ] Practice mode UI (basic, art ছাড়া কাজ করবে — placeholder দিয়ে টেস্ট)

---

## ৪. Track C — AI System (Permission-gated)

- [ ] **Typing DNA প্রোফাইল** — প্রতি ইউজারের জন্য: দুর্বল আঙুল, দুর্বল অক্ষর/যুক্তাক্ষর, সময়ভিত্তিক পারফরম্যান্স, ভুল যেগুলো ফিরে আসে
- [ ] **Rule-based fallback** (AI ছাড়া কাজ করবে) — সবচেয়ে বেশি ভুল হওয়া ৩টা অক্ষর/শব্দ দিয়ে lesson বানানো
- [ ] **AI-powered lesson generation** (Grok/Cerebras, শুধু `aiEnabled:true` হলে) — Typing DNA পাঠিয়ে প্রতিদিন নতুন lesson text চাওয়া
- [ ] **AI Coach message** — সেশন শেষে ছোট বাংলা ফিডব্যাক ("দ্র" নিয়ে আরও প্র্যাকটিস দরকার টাইপ)
- [ ] **AI Memory** — ৬ মাস আগের ভুল ট্র্যাক করে spaced-repetition এ ফিরিয়ে আনা
- [ ] Admin panel (তুমি নিজে) থেকে কার জন্য AI অন/অফ — টগল UI + Firestore flag

---

## ৫. Track D — Game/Gamification Engine

- [ ] Combat system: সঠিক শব্দ = attack, perfect = critical, ভুল = miss/enemy attack
- [ ] XP, Level, Gold — Firestore এ economy সেভ
- [ ] Enemy list (শুরুতে ৫-৬টা: Slime, Wolf, Zombie, Skeleton, Dragon Boss) — animation লাগবে (Track F দেখো)
- [ ] Inventory (basic): weapon/skin unlock system (লজিক আগে, আর্ট পরে যোগ হবে)
- [ ] Daily streak + daily challenge
- [ ] Leaderboard (নিজের progress track, একা হলেও future-proof রাখা)
- [ ] Replay system (V2 এ — টাইমলাইন ডেটা সেভ করা শুরু থেকেই, প্লেব্যাক UI পরে)

---

## ৬. Track E — Content (বাংলা কনটেন্ট)

- [ ] Beginner letter drills
- [ ] Word bank (frequency-based, দৈনন্দিন শব্দ)
- [ ] Sentence bank
- [ ] Short story/paragraph pool (৫-১০টা দিয়ে শুরু)
- [ ] যুক্তাক্ষর-ভিত্তিক ড্রিল সেট (এইটা আলাদা গুরুত্বপূর্ণ, কারণ AI Typing DNA এটার উপর নির্ভর করবে)

---

## ৭. Track F — Art & Character Design (সময় নিয়ে, আলাদা ধাপে)

এটা প্রোগ্রামিং-এর মতো দ্রুত হবে না — এটাকে একটা আলাদা মিনি-প্রজেক্ট হিসেবে ধরো:

- [ ] **ক্যারেক্টার কনসেপ্ট** — style ঠিক করা (pixel-art / anime / low-poly 3D — কোনটা তোমার ভিশনের সাথে মানানসই, এবং কোনটা একা বানানো সম্ভব সেটা বিবেচনা করে)
- [ ] Reference/moodboard জোগাড়
- [ ] Base character (idle, walk, attack, hit, victory animation) — এই ৫টা animation ন্যূনতম দরকার Phase 3 এর জন্য
- [ ] ১টা enemy (Slime বা Wolf) সম্পূর্ণ পাইপলাইন দিয়ে বানিয়ে প্যাটার্ন সেট করা, তারপর বাকিগুলো দ্রুত হবে
- [ ] Sound effect সোর্সিং (ফ্রি asset লাইব্রেরি থেকে শুরুতে, পরে কাস্টম)
- [ ] UI theme (রং, ফন্ট — বাংলা ফন্ট selection জরুরি, readability ভালো হতে হবে)

> এই ট্র্যাকের জন্য কী টুল/কীভাবে বানাবে (AI image gen / নিজে আঁকা / freelancer) সেটা আলাদা আলোচনা — যখন এই ধাপে আসব তখন ঠিক করব।

---

## ৮. রিভাইজড রোডম্যাপ (ধাপে ধাপে, প্রতিটা ধাপ শেষে কিছু "খেলাযোগ্য")

**Phase 1 — Core Playable (ফাউন্ডেশন)**
Track A (basic infra) + Track B (পুরো) + Track E (beginner content) → placeholder ভিজ্যুয়াল দিয়ে একটা কাজ করা টাইপিং টেস্ট, ফলাফল Firestore এ সেভ হচ্ছে।

**Phase 2 — AI Brain**
Track C পুরো (rule-based → AI gated) → এখন lesson গুলো তোমার ভুল অনুযায়ী তৈরি হচ্ছে।

**Phase 3 — Gamification + প্রথম Character**
Track D (core combat/economy) + Track F (base character + ১টা enemy সম্পূর্ণ) → প্রথমবার আসল "গেম" মনে হবে।

**Phase 4 — সম্পূর্ণ Bestiary + Theme + Sound**
Track D বাকি অংশ + Track F বাকি enemy/theme/sound।

**Phase 5 — Android release + polish**
Capacitor + GitHub Actions দিয়ে APK, replay system, streak/daily challenge পালিশ।

*(School/Company/Certification/Marketplace/Premium — কাঠামোয় জায়গা রাখা থাকবে কিন্তু বিল্ড হবে না যতক্ষণ না দরকার পড়ে)*

---

## ৯. পরের সিদ্ধান্ত (তোমার ইনপুট দরকার এই কয়েকটায়)

- Character/Art style কী হবে (pixel / anime / 3D) — এটা টাইম-এস্টিমেট বদলে দেবে
- Web framework: Vanilla JS/HTML নাকি React (Capacitor দুটোতেই কাজ করে)
- AI provider দুটোর (Grok/Cerebras) মধ্যে lesson-gen আর coach-message এর জন্য কোনটা প্রাইমারি রাখবে

এই প্ল্যান ঠিকঠাক লাগলে বলো, তখন Phase 1 / Track A দিয়ে কোড শুরু করব।

// Track E starter content. Small pool for now — Cloud/AI-generated lessons
// will replace/extend this in Phase 2. Keep this file easy to extend: just
// add more strings to the arrays.

const CONTENT_BANK = {
  letters: [
    "অ আ ই ঈ উ ঊ এ ঐ ও ঔ",
    "ক খ গ ঘ ঙ চ ছ জ ঝ ঞ",
    "ট ঠ ড ঢ ণ ত থ দ ধ ন",
    "প ফ ব ভ ম য র ল শ ষ স হ",
  ],
  conjuncts: [
    "ক্ষ জ্ঞ ত্র ন্দ ন্ত স্ত স্ব ন্ন ম্ম দ্ধ",
    "ক্ত ঙ্গ ঞ্চ ণ্ড ন্ধ প্ত ব্ধ শ্চ ষ্ণ হ্ন",
  ],
  words: [
    "আমি তুমি সে আমরা তোমরা তারা এটা ওটা এখানে সেখানে",
    "বাংলা দেশ মানুষ ভালোবাসা স্বাধীনতা ভাষা মা বাবা ঘর স্কুল",
    "আজ কাল সকাল বিকাল রাত দুপুর সময় দিন মাস বছর",
  ],
  sentences: [
    "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
    "আজ আকাশ পরিষ্কার এবং রোদ উঠেছে।",
    "সে প্রতিদিন সকালে হাঁটতে যায়।",
    "বাংলা ভাষা আমাদের গর্বের বিষয়।",
    "আমি প্রতিদিন বই পড়তে ভালোবাসি।",
  ],
};

function getPracticeText(level) {
  const pool = CONTENT_BANK[level] || CONTENT_BANK.words;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Track D — Enemy pool (placeholder emoji until Track F pixel-art sprites
// arrive). Structure is intentionally simple so swapping "emoji" for a real
// sprite path later is a one-line change per enemy, not a redesign.

const ENEMY_POOL = [
  { id: "slime", name: "Slime", emoji: "👹", defeatedEmoji: "💀" },
  { id: "wolf", name: "Wolf", emoji: "🐺", defeatedEmoji: "💀" },
  { id: "skeleton", name: "Skeleton", emoji: "☠️", defeatedEmoji: "💀" },
  { id: "ghost", name: "Ghost", emoji: "👻", defeatedEmoji: "💀" },
];

function getRandomEnemy() {
  return ENEMY_POOL[Math.floor(Math.random() * ENEMY_POOL.length)];
}

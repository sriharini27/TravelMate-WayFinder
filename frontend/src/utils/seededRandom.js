// A small, controlled (non-Math.random) pseudo-random generator used to
// personalize AI-generated itineraries. The same seed always produces the
// same sequence — this is what keeps a plan stable while a user is reviewing
// it, while still giving two different users (or two different requests)
// genuinely different, reproducible-on-demand variations.

/** Hashes an arbitrary string into a 32-bit integer seed. */
export function hashSeed(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return (h >>> 0) || 1
}

/** mulberry32 — a fast, deterministic PRNG. Returns a function yielding [0, 1). */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Builds a deterministic PRNG from any number of seed parts joined together. */
export function createSeededRandom(...parts) {
  const seed = hashSeed(parts.filter((p) => p !== undefined && p !== null).join('|'))
  return mulberry32(seed)
}

/** Deterministic Fisher-Yates shuffle driven by a seeded PRNG — never mutates the input. */
export function shuffleSeeded(array, rng) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Picks `count` items from `array` without replacement, using a seeded PRNG. */
export function pickSeeded(array, count, rng) {
  if (array.length === 0) return []
  return shuffleSeeded(array, rng).slice(0, Math.min(count, array.length))
}

export default { hashSeed, mulberry32, createSeededRandom, shuffleSeeded, pickSeeded }

import citiesData from '../data/cities.js'

const TIER_SCORE = { Near: 2, Mid: 3, Far: 4 }

/**
 * Ranks destinations by how "close" they are to a given source city —
 * same-region domestic destinations first, then other domestic, then
 * international destinations ordered by distance tier.
 */
export function getClosestDestinations(sourceCityName, destinationsList, limit = 4) {
  const source = citiesData.find((c) => c.name === sourceCityName)
  const sourceRegion = source?.region

  const scored = destinationsList.map((d) => {
    let score
    if (d.region === 'International') {
      score = 5 + (TIER_SCORE[d.distanceTier] || 3)
    } else if (sourceRegion && d.region === sourceRegion) {
      score = 0
    } else {
      score = 1
    }
    return { destination: d, score }
  })

  scored.sort((a, b) => a.score - b.score || b.destination.rating - a.destination.rating)
  return scored.slice(0, limit).map((s) => s.destination)
}

export default getClosestDestinations

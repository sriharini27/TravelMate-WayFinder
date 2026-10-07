// Mutable cache of verified, real-world attractions per destination,
// populated from MongoDB (the Attraction collection) via CatalogContext.
// The AI itinerary generator (utils/generateTrip.js) selects only from this
// pool, so it can never surface a fictional or unverified place.
export const attractionsByDestination = {}

export function setAllAttractions(items) {
  Object.keys(attractionsByDestination).forEach((k) => delete attractionsByDestination[k])
  items.forEach((a) => {
    if (!attractionsByDestination[a.destination]) attractionsByDestination[a.destination] = []
    attractionsByDestination[a.destination].push(a)
  })
}

/** Verified + active attractions for a destination, or [] if none are seeded yet. */
export function getAttractions(destinationName) {
  return attractionsByDestination[destinationName] || []
}

export default attractionsByDestination

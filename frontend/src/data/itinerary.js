// Mutable cache of each destination's AI-planner activity bank, populated from
// MongoDB (the Itinerary collection) via CatalogContext — see destinations.js.
export const itineraryBank = {}

export function setItineraryBank(destinationName, bank) {
  itineraryBank[destinationName] = bank
}

export function setAllItineraryBanks(items) {
  Object.keys(itineraryBank).forEach((k) => delete itineraryBank[k])
  items.forEach((it) => {
    itineraryBank[it.destination] = {
      attractions: it.attractions,
      tips: it.tips,
      activities: it.activities,
    }
  })
}

export default itineraryBank

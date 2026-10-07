// Mutable cache populated from MongoDB via CatalogContext — see destinations.js.
export const hotels = []

export function setHotels(list) {
  hotels.length = 0
  hotels.push(...list)
}

export default hotels

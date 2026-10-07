// Mutable cache of per-destination weather, derived from each Destination
// document's embedded `weather` field (populated via CatalogContext).
export const weather = {}

export function setWeather(allDestinations) {
  Object.keys(weather).forEach((k) => delete weather[k])
  allDestinations.forEach((d) => {
    if (d.weather) weather[d.name] = d.weather
  })
}

export default weather

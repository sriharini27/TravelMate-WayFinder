import citiesData from '../data/cities.js'

// Rough per-person base cost for an international flight, by how far the
// destination's distanceTier is from India.
const INTERNATIONAL_TIER_BASE = { Near: 20000, Mid: 35000, Far: 60000 }

// Rough per-person base cost for a domestic trip, by transport mode.
const DOMESTIC_MODE_BASE = { Flight: 9000, Train: 3000, Bus: 1500 }

/**
 * Estimates per-traveller transport cost using the actual source → destination
 * route, rather than a flat percentage of budget. Domestic trips within the
 * same region as the departure city are cheaper than cross-country ones;
 * international trips scale with the destination's distance tier.
 */
export function estimateTransportCost({ sourceCity, destination, travellers, transportMode }) {
  const count = Math.max(1, Number(travellers) || 1)
  if (!destination) return DOMESTIC_MODE_BASE.Flight * count

  if (destination.region === 'International') {
    const base = INTERNATIONAL_TIER_BASE[destination.distanceTier] || INTERNATIONAL_TIER_BASE.Mid
    return Math.round(base * count)
  }

  const source = citiesData.find((c) => c.name === sourceCity)
  const sameRegion = !!(source && destination.region && source.region === destination.region)
  const modeBase = DOMESTIC_MODE_BASE[transportMode] || DOMESTIC_MODE_BASE.Flight
  const multiplier = sameRegion ? 0.55 : 1.15

  return Math.round(modeBase * multiplier * count)
}

export default estimateTransportCost

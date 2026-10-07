import hotelsData from '../data/hotels.js'
import destinationsData from '../data/destinations.js'
import itineraryBank from '../data/itinerary.js'
import weatherData from '../data/weather.js'
import { getAttractions } from '../data/attractions.js'

const GENERIC_HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
]

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * Generates 3 plausible hotels for a destination that has no hand-authored
 * entries in data/hotels.js, so every city in the catalog works end-to-end
 * in the planner without needing bespoke data for each one.
 */
function generateFallbackHotels(destination) {
  const h = hashString(destination.name)
  const baseNight = Math.max(2500, Math.round(destination.price / 6 / 100) * 100)

  return [0, 1, 2].map((i) => {
    const variance = 1 + ((h >> (i * 4)) % 40) / 100
    return {
      id: `auto-${destination.id}-${i}`,
      destination: destination.name,
      name: `${destination.name} ${['Central Stay', 'Garden Retreat', 'Skyline Hotel'][i]}`,
      rating: [4.3, 4.5, 4.7][i],
      pricePerNight: Math.round((baseNight * variance) / 50) * 50,
      distanceFromCenter: `${1 + i} km from ${destination.name} center`,
      image: GENERIC_HOTEL_IMAGES[i],
      amenities: [
        ['Free WiFi', 'Breakfast included'],
        ['Pool', 'Free WiFi'],
        ['Spa', 'Airport shuttle'],
      ][i],
      standardCheckIn: i === 2 ? '3:00 PM' : '12:00 PM',
      standardCheckOut: '11:00 AM',
      earlyCheckinAvailable: i !== 1,
      earlyCheckinFee: i === 0 ? 500 : i === 2 ? 900 : 0,
    }
  })
}

// Only reached for a destination with no Itinerary bank in MongoDB at all —
// every destination in the live catalog is seeded with one (see
// server/seeds/seed.js), so this is a last-resort safety net, not the normal
// path. It deliberately does NOT invent attraction names like "City Center"
// or "Old Town": it uses the verified Attraction collection if any rows
// exist for this destination, and otherwise falls back to honest, place-
// name-free text rather than fabricating a tourist spot that doesn't exist.
function generateFallbackBank(destination) {
  const name = destination.name
  const verified = getAttractions(name)

  const tips = [
    `Carry some local currency for small vendors in ${name}.`,
    `Book the most popular attractions in ${name} a day ahead.`,
    `Check a live weather forecast before planning outdoor days.`,
  ]

  if (verified.length > 0) {
    const byCategory = {}
    verified.forEach((a) => {
      if (!byCategory[a.category]) byCategory[a.category] = a
    })
    const pick = (category) => byCategory[category] || byCategory.Landmark || byCategory.Culture || verified[0]
    return {
      attractions: verified.slice(0, 8).map((a) => a.name),
      tips,
      activities: {
        Arrival: 'Airport pickup and hotel check-in',
        Adventure: `Guided visit to ${pick('Adventure').name}`,
        Beach: `Relaxing time at ${pick('Beach').name}`,
        Nature: `Scenic visit to ${pick('Nature').name}`,
        History: `Guided visit to ${pick('History').name}`,
        Shopping: `Shopping trip to ${pick('Shopping').name}`,
        Food: `Food experience at ${pick('Food').name}`,
        Luxury: `Visit to ${pick('Landmark').name}`,
        Nightlife: `Evening out at ${pick('Nightlife').name}`,
      },
    }
  }

  // No verified attractions seeded yet for this destination — be honest
  // about it rather than naming a place that may not exist.
  return {
    attractions: [],
    tips: [...tips, `Verified attraction details for ${name} are being added — check back soon.`],
    activities: {
      Arrival: 'Airport pickup and hotel check-in',
      Adventure: `Local adventure experience in ${name} (details coming soon)`,
      Beach: `Local beach time in ${name} (details coming soon)`,
      Nature: `Local nature spot in ${name} (details coming soon)`,
      History: `Local heritage experience in ${name} (details coming soon)`,
      Shopping: `Local shopping in ${name} (details coming soon)`,
      Food: `Local food experience in ${name} (details coming soon)`,
      Luxury: `Premium experience in ${name} (details coming soon)`,
      Nightlife: `Evening out in ${name} (details coming soon)`,
    },
  }
}

function generateFallbackWeather(destination) {
  const h = hashString(destination.name)
  const conditions = ['Partly Cloudy', 'Sunny', 'Mild & Clear', 'Warm & Humid', 'Breezy']
  return {
    temperature: 20 + (h % 15),
    condition: conditions[h % conditions.length],
    humidity: 45 + (h % 35),
    wind: `${8 + (h % 15)} km/h`,
    recommendation: `Typical conditions for ${destination.name} — check a live forecast closer to your travel date.`,
  }
}

/** Returns curated hotels for a destination if they exist, else generates plausible ones. */
export function getHotelsForDestination(destinationName) {
  const curated = hotelsData.filter((h) => h.destination === destinationName)
  if (curated.length > 0) return curated
  const destObj = destinationsData.find((d) => d.name === destinationName)
  if (!destObj) return []
  return generateFallbackHotels(destObj)
}

/** Returns curated attractions/tips/activities for a destination, else generates them. */
export function getBankForDestination(destinationName) {
  const curated = itineraryBank[destinationName]
  if (curated) return curated
  const destObj = destinationsData.find((d) => d.name === destinationName) || { name: destinationName }
  return generateFallbackBank(destObj)
}

/** Returns curated weather for a destination, else generates a plausible reading. */
export function getWeatherForDestination(destinationName) {
  const curated = weatherData[destinationName]
  if (curated) return curated
  const destObj = destinationsData.find((d) => d.name === destinationName) || { name: destinationName }
  return generateFallbackWeather(destObj)
}

import destinationsData from '../data/destinations.js'
import { parseTimeToMinutes, minutesToLabel } from './arrivalLogic.js'
import { getHotelsForDestination, getBankForDestination, getWeatherForDestination } from './destinationHelpers.js'
import { estimateTransportCost } from './transportCost.js'
import { getAttractions } from '../data/attractions.js'
import { createSeededRandom, shuffleSeeded } from './seededRandom.js'

const DAY_LABELS = ['Arrival', 'Adventure', 'Nature', 'Beach', 'History', 'Shopping', 'Food', 'Luxury']

// Maps a planner "interest" to the verified-Attraction category it draws
// from. Luxury has no direct category, so it prefers a Landmark/Culture pick
// — a genuinely premium real place rather than an invented one.
const INTEREST_TO_CATEGORY = {
  Adventure: 'Adventure',
  Nature: 'Nature',
  Beach: 'Beach',
  History: 'History',
  Food: 'Food',
  Shopping: 'Shopping',
  Nightlife: 'Nightlife',
  Luxury: 'Landmark',
}
const CATEGORY_TO_INTEREST = Object.fromEntries(Object.entries(INTEREST_TO_CATEGORY).map(([k, v]) => [v, k]))

// Exported so other parts of the app (offer matching before payment) can
// translate a trip's planner "interests" into the same verified-Attraction
// category vocabulary offers are tagged with, without duplicating this map.
export { INTEREST_TO_CATEGORY }

/** Translates a trip's planner interests into Attraction/Offer categories. */
export function interestsToCategories(interests = []) {
  const mapped = interests.map((i) => INTEREST_TO_CATEGORY[i]).filter(Boolean)
  return [...new Set(mapped)]
}

/**
 * Builds a seeded, interest-ordered queue of this destination's VERIFIED
 * attractions only (never a fallback/invented name). Interest-matching
 * categories are shuffled to the front so they surface earliest in the trip,
 * while the whole queue stays deterministic for a given seed.
 */
function buildAttractionQueue(destination, interests, rng) {
  const pool = getAttractions(destination)
  if (pool.length === 0) return []
  const wantedCategories = interests.map((i) => INTEREST_TO_CATEGORY[i]).filter(Boolean)
  const matched = pool.filter((a) => wantedCategories.includes(a.category))
  const rest = pool.filter((a) => !wantedCategories.includes(a.category))
  return [...shuffleSeeded(matched, rng), ...shuffleSeeded(rest, rng)]
}

/** Draws the next attraction from the queue, cycling back only once every
 * verified attraction has already appeared once in this trip — a small
 * destination's attraction pool is a legitimate reason to repeat a place on
 * a later day, but never before everything else has had a turn. */
function makeDrawer(queue) {
  let cursor = 0
  return function draw() {
    if (queue.length === 0) return null
    const attraction = queue[cursor % queue.length]
    cursor++
    return attraction
  }
}

function buildDay1({ arrivalTime, arrivalOption, hotel, bank, interests, draw }) {
  const nearby = draw()
  const nearbyLabel = nearby ? nearby.name : bank?.attractions?.[0] || 'the city center'
  const mainSight = draw()
  const mainLabel = mainSight ? mainSight.name : bank?.attractions?.[0] || 'City center'

  if (!arrivalTime) {
    return {
      activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'],
      cost: null,
    }
  }

  const arrivalMin = parseTimeToMinutes(arrivalTime)
  if (arrivalMin == null) {
    return {
      activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'],
      cost: null,
    }
  }

  let checkinMin
  if (arrivalOption) {
    checkinMin =
      arrivalOption.id === 'previous_night'
        ? arrivalMin
        : parseTimeToMinutes(arrivalOption.time) ?? arrivalMin
  } else {
    const standardMin = parseTimeToMinutes(hotel.standardCheckIn)
    checkinMin = standardMin != null ? Math.max(arrivalMin, standardMin) : arrivalMin
  }

  const timeline = [{ time: minutesToLabel(arrivalMin), activity: 'Arrival', cost: 0 }]

  if (arrivalOption?.id === 'luggage') {
    timeline.push({ time: minutesToLabel(arrivalMin + 15), activity: 'Store luggage at hotel', cost: 0 })
    timeline.push({
      time: minutesToLabel(arrivalMin + 45),
      activity: `Nearby sightseeing — ${nearbyLabel}`,
      cost: 500,
    })
  }

  timeline.push({
    time: minutesToLabel(checkinMin),
    activity: arrivalOption?.id === 'previous_night' ? 'Room ready — Check-in' : 'Hotel Check-in',
    cost: 0,
  })
  timeline.push({ time: minutesToLabel(checkinMin + 60), activity: 'Breakfast', cost: 400 })
  timeline.push({
    time: minutesToLabel(checkinMin + 180),
    activity: `${interests[0] || 'Local'} Exploration — ${mainLabel}`,
    cost: 1200,
  })
  timeline.push({ time: minutesToLabel(checkinMin + 330), activity: 'Lunch', cost: 600 })
  timeline.push({
    time: minutesToLabel(checkinMin + 480),
    activity: bank?.activities?.[interests[1]] || 'Evening leisure walk',
    cost: 900,
  })
  timeline.push({ time: minutesToLabel(checkinMin + 690), activity: 'Dinner', cost: 700 })

  return {
    activities: timeline.map((t) => `${t.time} — ${t.activity}`),
    cost: timeline.reduce((sum, t) => sum + t.cost, 0),
  }
}

/**
 * Simulates an AI-generated trip plan using deterministic rules over the
 * dummy data banks. No external API is called. Implements "Arrival-Aware
 * Trip Optimization" (Day 1 adapts to arrival time + check-in strategy) and
 * source→destination transport cost estimation for a more accurate budget.
 *
 * Itinerary personalization: which attractions fill days 2+ (and Day 1's
 * "nearby sightseeing" line) is driven by a seeded, controlled shuffle — see
 * seededRandom.js — keyed on exactly the inputs that define a trip
 * "version" (userId, destination, interests, days, travellers, budget,
 * arrival time, transport, generationCount). Two different users requesting
 * the same destination get different valid plans; the same user reviewing
 * the same plan sees it stay stable until they explicitly click Generate
 * again (generationCount only increments then — selecting a hotel or an
 * arrival strategy recalculates cost/timing with the SAME seed). Every
 * attraction used comes from the verified Attraction collection for that
 * destination; nothing is ever invented.
 */
export function generateTrip(formData) {
  const {
    destination = 'Bali',
    sourceCity = '',
    budget = 50000,
    days = 3,
    travellers = 2,
    hotelRating = 4,
    interests = [],
    arrivalTime = '',
    departureTime = '',
    transport = 'Flight',
    selectedHotel = null,
    arrivalOption = null,
    userId = 'guest',
    generationCount = 0,
  } = formData

  const destinationObj = destinationsData.find((d) => d.name === destination) || null
  const bank = getBankForDestination(destination)
  const dayCount = Math.min(Math.max(Number(days) || 3, 1), 7)
  const travellerCount = Math.max(1, Number(travellers) || 1)

  const rng = createSeededRandom(
    userId,
    destination,
    interests.join(','),
    dayCount,
    travellerCount,
    budget,
    arrivalTime,
    transport,
    generationCount
  )
  const attractionQueue = buildAttractionQueue(destination, interests, rng)
  const draw = makeDrawer(attractionQueue)

  // The "budget" field is a per-person figure — scale it up to the total
  // budget available for the whole group before computing any costs.
  const perPersonBudget = Number(budget) || 50000
  const totalBudget = perPersonBudget * travellerCount

  const destinationHotels = getHotelsForDestination(destination)
  const hotel =
    selectedHotel ||
    [...destinationHotels].sort((a, b) => Math.abs(a.rating - hotelRating) - Math.abs(b.rating - hotelRating))[0] ||
    destinationHotels[0]

  // Fixed costs — these are computed from real route/hotel data, not a
  // percentage of budget, so they're worked out first.
  let hotelCost = hotel.pricePerNight * dayCount
  let earlyCheckinFee = 0
  if (arrivalOption) {
    if (arrivalOption.id === 'previous_night') {
      hotelCost += hotel.pricePerNight // one extra night to guarantee the room
    } else {
      earlyCheckinFee = arrivalOption.fee || 0
    }
  }

  const flightEstimate = estimateTransportCost({
    sourceCity,
    destination: destinationObj,
    travellers: travellerCount,
    transportMode: transport,
  })

  const fixedCosts = flightEstimate + hotelCost + earlyCheckinFee
  // Whatever's left of the budget after transport and hotel is what actually
  // funds activities, food and misc — floor it at 10% of budget so a trip
  // with very high fixed costs doesn't zero these out entirely.
  const remaining = Math.max(totalBudget - fixedCosts, Math.round(totalBudget * 0.1))

  const targetActivities = Math.round(remaining * 0.55)
  const foodEstimate = Math.round(remaining * 0.3)
  const miscEstimate = Math.round(remaining * 0.15)

  const perDayBase = Math.round(targetActivities / dayCount)

  const rawDays = Array.from({ length: dayCount }).map((_, idx) => {
    if (idx === 0) {
      const { activities, cost } = buildDay1({ arrivalTime, arrivalOption, hotel, bank, interests, draw })
      return {
        day: 1,
        title: 'Arrival & Settling In',
        activities,
        estimatedCost: cost ?? perDayBase,
      }
    }

    // Two real, verified attractions per day (no duplicates within the trip
    // until the whole pool has had a turn), plus one generic leisure slot.
    const first = draw()
    const second = draw()
    const variance = 0.85 + rng() * 0.3

    const title = first ? CATEGORY_TO_INTEREST[first.category] || first.category : DAY_LABELS[idx % DAY_LABELS.length]
    const activities = []
    if (first) activities.push(`${first.name} — ${first.description || 'Guided sightseeing'}`)
    if (second && second.name !== first?.name) activities.push(`${second.name} — ${second.description || 'Local exploration'}`)
    if (activities.length === 0) {
      // No verified attractions seeded for this destination yet — fall back
      // to the destination's activity bank text rather than inventing a place.
      const key = interests[idx % Math.max(interests.length, 1)] || DAY_LABELS[idx % DAY_LABELS.length]
      activities.push(bank.activities[key] || bank.activities.Arrival || 'Local exploration')
    }
    activities.push('Leisure evening')

    return {
      day: idx + 1,
      title,
      activities,
      estimatedCost: Math.round(perDayBase * variance),
    }
  })

  // Scale the day-by-day costs so they add up to the activities budget we
  // actually have available, rather than drifting from an independent guess.
  const rawTotal = rawDays.reduce((sum, d) => sum + d.estimatedCost, 0)
  const scaleFactor = rawTotal > 0 ? targetActivities / rawTotal : 1
  const days_ = rawDays.map((d) => ({
    ...d,
    estimatedCost: Math.max(0, Math.round((d.estimatedCost * scaleFactor) / 100) * 100),
  }))

  const totalActivityCost = days_.reduce((sum, d) => sum + d.estimatedCost, 0)
  const total = hotelCost + totalActivityCost + flightEstimate + foodEstimate + earlyCheckinFee + miscEstimate

  return {
    destination,
    sourceCity,
    // The planner's selected interests, carried through on the trip so later
    // steps (offer matching) can know which itinerary/activity categories
    // this trip covers without having to re-parse the day-by-day text.
    interests,
    summary: `A ${dayCount}-day ${interests[0] ? interests[0].toLowerCase() : 'curated'} getaway from ${sourceCity || 'your city'} to ${destination} for ${travellerCount} traveller${travellerCount > 1 ? 's' : ''}, balancing must-see landmarks with relaxed downtime.`,
    weather: getWeatherForDestination(destination),
    attractions: bank.attractions,
    tips: bank.tips,
    hotel: {
      ...hotel,
      nights: dayCount,
      totalHotelCost: hotelCost,
    },
    itinerary: days_,
    arrivalStrategy: arrivalOption
      ? { ...arrivalOption, arrivalTime, standardCheckIn: hotel.standardCheckIn }
      : null,
    departureTime,
    generationCount,
    budget: {
      flights: flightEstimate,
      hotel: hotelCost,
      activities: totalActivityCost,
      food: foodEstimate,
      earlyCheckinFee,
      misc: miscEstimate,
      total,
      perPersonRequested: perPersonBudget,
      requested: totalBudget,
      perTraveller: Math.round(total / travellerCount),
      travellers: travellerCount,
      withinBudget: total <= totalBudget * 1.1,
    },
  }
}

export default generateTrip

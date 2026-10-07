const asyncHandler = require('express-async-handler')
const ChatHistory = require('../models/ChatHistory')
const Destination = require('../models/Destination')
const Package = require('../models/Package')
const Hotel = require('../models/Hotel')
const Offer = require('../models/Offer')
const Attraction = require('../models/Attraction')
const Booking = require('../models/Booking')

// Rule-based assistant — no generative AI. Two layers:
//   1. Data-aware intents (packages, hotels, offers, attractions, weather, destination
//      summary, the signed-in user's trips) answered from the real MongoDB collections.
//   2. A static knowledge base for how-to questions, matched on whole words.
const FALLBACK =
  "I'm the TravelMate Assistant — a rule-based helper, not a generative AI. Try asking things like " +
  '"package details in Bali", "hotels in Goa", "offers for Paris", "attractions in Jaipur", ' +
  '"weather in Manali", "upcoming trips", "what is early check-in" or "how do I book".'

const KNOWLEDGE_BASE = [
  {
    topic: 'early-checkin',
    keywords: ['early check-in', 'early checkin', 'check in early', 'early check in'],
    reply:
      'Early check-in lets you access your hotel room before the standard check-in time when the selected hotel supports it. A small early check-in fee may apply, and it adjusts your Day 1 itinerary and budget automatically.',
  },
  {
    topic: 'arrival-aware',
    keywords: ['arrival-aware', 'arrival aware', 'arrival time', 'what is arrival', 'smart trip'],
    reply:
      "Arrival-Aware Smart Trip Planning is TravelMate's core feature — it looks at your actual arrival time versus the hotel's standard check-in time and builds your Day 1 plan and budget around it, offering early check-in, flexible check-in, previous-night booking or luggage storage as needed.",
  },
  {
    topic: 'flexible-checkin',
    keywords: ['flexible check-in', 'flexible checkin', 'flexible check in'],
    reply:
      'Flexible check-in reschedules your Day 1 plan so hotel check-in happens whenever you actually arrive, without an early check-in fee, by adjusting the order of your first-day activities.',
  },
  {
    topic: 'previous-night',
    keywords: ['previous night', 'previous-night', 'book the night before'],
    reply:
      'Previous-night booking reserves your room from the night before you land, guaranteeing it is ready the moment you arrive — it adds one extra night to your hotel cost.',
  },
  {
    topic: 'luggage-storage',
    keywords: ['luggage storage', 'luggage', 'store my bags', 'store luggage'],
    reply:
      "If you land well before check-in and don't want to pay for early check-in, you can store your luggage at the hotel and start a nearby activity right away — TravelMate adds a short local activity to your Day 1 plan for this.",
  },
  {
    topic: 'payment',
    keywords: ['payment', 'payments', 'pay', 'upi', 'card', 'net banking', 'netbanking', 'demo payment', 'simulate'],
    reply:
      'TravelMate uses a Demo Payment simulation for this project — no real money, card or UPI network is involved. You can simulate a successful, failed, or pending payment; a booking is only created after a simulated successful payment.',
  },
  {
    topic: 'booking',
    keywords: ['book', 'booking', 'bookings', 'book a trip', 'how do i book', 'reserve'],
    reply:
      'To book a trip: plan it in the AI Trip Planner (or pick a package), choose your hotel and arrival strategy, check the offers that match your trip, review the summary, then complete the Demo Payment step. Once payment succeeds, your booking appears in My Trips.',
  },
  {
    topic: 'my-trips',
    keywords: ['my trips', 'my trip', 'track my trip', 'where is my booking'],
    reply:
      "My Trips shows every booking you've made, grouped by Upcoming, Ongoing, Completed and Cancelled. Once you confirm arrival, you can mark each day of your itinerary as explored, and the trip completes automatically once every day is done.",
  },
  {
    topic: 'cancel',
    keywords: ['cancel', 'cancellation', 'refund'],
    reply:
      'You can cancel a booking from My Trips. Once cancelled, a trip cannot be marked as explored or reactivated — you would need to make a new booking.',
  },
  {
    topic: 'planner',
    keywords: ['planner', 'plan a trip', 'plan my trip', 'itinerary', 'trip plan'],
    reply:
      'Open the AI Trip Planner, enter your source city, destination, dates, travellers, budget and interests (plus your arrival time), and TravelMate builds a day-wise itinerary, hotel recommendation and budget for you. The itinerary only uses verified attractions of that destination.',
  },
  {
    topic: 'budget',
    keywords: ['budget', 'cost', 'how much'],
    reply:
      'Your trip budget is treated as a per-person amount — TravelMate multiplies it by your traveller count, subtracts fixed costs like transport and hotel, then allocates the rest across activities, food and incidentals.',
  },
  {
    topic: 'hotel',
    keywords: ['hotel', 'hotels', 'stay', 'accommodation'],
    reply:
      'TravelMate recommends a hotel for your destination based on your preferred rating, and also lets you browse and switch between alternative hotels for the same trip before booking. Mention a destination (e.g. "hotels in Goa") to see the actual hotels.',
  },
  {
    topic: 'destination',
    keywords: ['destination', 'destinations', 'where should i go', 'places to visit'],
    reply:
      'Browse Popular Destinations on the homepage or search by your source city and travel style — TravelMate will also suggest the closest matching destinations to where you are travelling from.',
  },
  {
    topic: 'wishlist',
    keywords: ['wishlist', 'save', 'favourite', 'favorite'],
    reply:
      'Tap the heart icon on any destination, hotel or package to save it to your Wishlist, and open the Wishlist page from the menu to see everything you saved.',
  },
  {
    topic: 'language',
    keywords: ['language', 'tamil', 'hindi', 'translate'],
    reply: 'TravelMate is available in English, Tamil and Hindi — switch the language from the language selector in the navigation bar.',
  },
  {
    topic: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'help', 'thanks', 'thank you'],
    reply:
      'Hello! I can show package details, hotels, offers, attractions and weather for any TravelMate destination, summarise your trips, and explain how planning, check-in strategies, booking and the demo payment work. What would you like to know?',
  },
]

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasWord = (text, words) => words.some((w) => new RegExp(`\\b${escapeRe(w)}\\b`).test(text))
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const bullets = (lines) => lines.map((l) => `• ${l}`).join('\n')

function matchKnowledge(lower) {
  // Longest matching keyword wins, so specific phrases beat short generic words.
  let best = null
  let bestLen = 0
  for (const entry of KNOWLEDGE_BASE) {
    for (const k of entry.keywords) {
      if (k.length > bestLen && new RegExp(`\\b${escapeRe(k)}\\b`).test(lower)) {
        best = entry
        bestLen = k.length
      }
    }
  }
  return best
}

function findDestination(lower, destinations) {
  // Full name first ("sri lanka"), then any distinctive word of a multi-word name ("andaman", "lanka").
  const full = destinations.find((d) => new RegExp(`\\b${escapeRe(d.name.toLowerCase())}\\b`).test(lower))
  if (full) return full
  return destinations.find((d) =>
    d.name
      .toLowerCase()
      .split(/\s+/)
      .some((w) => w.length >= 5 && new RegExp(`\\b${escapeRe(w)}\\b`).test(lower))
  )
}

async function tripsReply(lower, user) {
  if (!user) {
    return { topic: 'trips', reply: 'Please log in to see your trips — once you are signed in I can summarise your Upcoming, Ongoing, Completed and Cancelled bookings here, or you can open My Trips from the menu.' }
  }
  const bookings = await Booking.find({ user: user._id }).sort('-createdAt').lean()
  if (!bookings.length) {
    return { topic: 'trips', reply: "You haven't made any bookings yet. Plan a trip in the AI Trip Planner or pick a package, and it will appear in My Trips after the demo payment succeeds." }
  }
  const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']
  const wanted = /\bupcoming\b/.test(lower) ? 'Upcoming' : /\bongoing\b|\bcurrent\b/.test(lower) ? 'Ongoing' : /\bcompleted\b|\bpast\b/.test(lower) ? 'Completed' : /cancel/.test(lower) ? 'Cancelled' : null
  const counts = statuses.map((s) => `${s}: ${bookings.filter((b) => b.bookingStatus === s).length}`).join(' • ')
  if (!wanted) {
    return { topic: 'trips', reply: `You have ${bookings.length} booking${bookings.length > 1 ? 's' : ''} — ${counts}. Ask for "upcoming trips", "completed trips" etc. for details, or open My Trips from the menu.` }
  }
  const list = bookings.filter((b) => b.bookingStatus === wanted).slice(0, 5)
  if (!list.length) return { topic: 'trips', reply: `You have no ${wanted.toLowerCase()} trips right now. (${counts})` }
  const lines = list.map((b) => `${b.destination} — ${b.checkInDate || 'date TBD'}${b.checkOutDate ? ' to ' + b.checkOutDate : ''}, ${b.travellers || 1} traveller(s), ${inr(b.totalAmount)} (${b.bookingId})`)
  return { topic: 'trips', reply: `Your ${wanted.toLowerCase()} trips:\n${bullets(lines)}\nOpen My Trips for the full itinerary and day-by-day tracking.` }
}

async function packagesReply(dest) {
  if (!dest) {
    const all = await Package.find({}).lean()
    const by = {}
    all.forEach((p) => {
      by[p.destination] = by[p.destination] ? Math.min(by[p.destination], p.price) : p.price
    })
    const lines = Object.entries(by).map(([d, min]) => `${d} — from ${inr(min)}`)
    if (!lines.length) return { topic: 'packages', reply: 'There are no packages available right now.' }
    return { topic: 'packages', reply: `We have packages for ${lines.length} destinations:\n${bullets(lines)}\nAsk "package details in <destination>" (for example Bali) for the full breakdown.` }
  }
  const pkgs = await Package.find({ destination: dest.name }).lean()
  if (!pkgs.length) {
    return { topic: 'packages', reply: `There are no ready-made packages for ${dest.name} yet, but you can build a custom trip there with the AI Trip Planner.` }
  }
  const today = new Date().toISOString().slice(0, 10)
  const blocks = pkgs.slice(0, 4).map((p) => {
    const upcoming = (p.availableDates || []).filter((d) => d >= today).slice(0, 3)
    return [
      `${p.name} — ${p.duration || p.days + ' days'}, ${inr(p.price)}${p.discount ? ` (${p.discount}% off, was ${inr(p.originalPrice)})` : ''}, rated ${p.rating}`,
      p.highlights?.length ? `  Highlights: ${p.highlights.join(', ')}` : null,
      p.included?.length ? `  Includes: ${p.included.slice(0, 4).join(', ')}` : null,
      upcoming.length ? `  Next dates: ${upcoming.join(', ')}` : null,
    ].filter(Boolean).join('\n')
  })
  return { topic: 'packages', reply: `Packages in ${dest.name}:\n${blocks.join('\n')}\nOpen the package from the homepage to see the day-wise plan and book it.` }
}

async function hotelsReply(dest) {
  const hotels = await Hotel.find({ destination: dest.name }).sort('-rating').limit(5).lean()
  if (!hotels.length) return { topic: 'hotels', reply: `I couldn't find hotels listed for ${dest.name} yet.` }
  const lines = hotels.map((h) => `${h.name} — ${inr(h.pricePerNight)}/night, rated ${h.rating}, check-in ${h.standardCheckIn}${h.earlyCheckinAvailable ? `, early check-in available (${inr(h.earlyCheckinFee)})` : ''}`)
  return { topic: 'hotels', reply: `Hotels in ${dest.name}:\n${bullets(lines)}` }
}

async function offersReply(dest) {
  const now = new Date()
  const filter = { active: true, validTill: { $gte: now } }
  if (dest) filter.$or = [{ destination: dest.name }, { destination: '' }]
  const offers = await Offer.find(filter).limit(5).lean()
  if (!offers.length) return { topic: 'offers', reply: `There are no active offers${dest ? ` for ${dest.name}` : ''} right now.` }
  const lines = offers.map((o) => `${o.title} — ${o.discountPercent}% off with code ${o.code}${o.destination ? ` (${o.destination})` : ''}${o.applicableCategories?.length ? `, for ${o.applicableCategories.join('/')} trips` : ''}, valid till ${fmtDate(o.validTill)}`)
  return { topic: 'offers', reply: `Active offers${dest ? ` for ${dest.name}` : ''}:\n${bullets(lines)}\nMatching offers are shown automatically before payment when you book.` }
}

async function attractionsReply(dest) {
  const items = await Attraction.find({ destination: dest.name, verified: true, isActive: true }).sort('-rating').limit(8).lean()
  if (!items.length) return { topic: 'attractions', reply: `I don't have verified attractions listed for ${dest.name} yet.` }
  return { topic: 'attractions', reply: `Top verified attractions in ${dest.name}:\n${bullets(items.map((a) => `${a.name} (${a.category}, rated ${a.rating})`))}` }
}

function weatherReply(dest) {
  const w = dest.weather || {}
  const parts = []
  if (w.condition) parts.push(`${w.condition}${w.temperature != null ? `, around ${w.temperature}°C` : ''}${w.humidity != null ? `, ${w.humidity}% humidity` : ''}${w.wind ? `, wind ${w.wind}` : ''}`)
  if (w.recommendation) parts.push(w.recommendation)
  if (dest.bestSeason) parts.push(`Best season: ${dest.bestSeason}`)
  return { topic: 'weather', reply: parts.length ? `${dest.name} weather: ${parts.join('. ')}.` : `I don't have weather details for ${dest.name} yet.` }
}

async function destinationReply(dest) {
  const [pkgCount, hotelCount] = await Promise.all([Package.countDocuments({ destination: dest.name }), Hotel.countDocuments({ destination: dest.name })])
  const lines = [
    `${dest.name}, ${dest.country}${dest.rating ? ` — rated ${dest.rating}` : ''}`,
    dest.description,
    dest.price ? `Indicative price: ${inr(dest.price)} per person` : null,
    dest.bestSeason ? `Best season: ${dest.bestSeason}` : null,
    dest.budgetEstimate ? `Typical budget: ${dest.budgetEstimate}` : null,
    `${pkgCount} package(s) and ${hotelCount} hotel(s) available.`,
  ].filter(Boolean)
  return { topic: 'destination-info', reply: `${lines.join('\n')}\nTry "package details in ${dest.name}", "hotels in ${dest.name}" or "attractions in ${dest.name}".` }
}

async function answer(message, user) {
  const lower = message.toLowerCase()
  const destinations = await Destination.find({}).lean()
  const dest = findDestination(lower, destinations)

  if (hasWord(lower, ['trip', 'trips', 'booking', 'bookings']) && hasWord(lower, ['my', 'upcoming', 'ongoing', 'completed', 'cancelled', 'canceled', 'past', 'current']) && !hasWord(lower, ['how do i book', 'book a trip']))
    return tripsReply(lower, user)
  if (hasWord(lower, ['upcoming', 'ongoing', 'completed', 'cancelled', 'canceled']) && !dest) return tripsReply(lower, user)
  if (hasWord(lower, ['package', 'packages', 'tour', 'tours', 'deal', 'deals'])) return packagesReply(dest)
  if (hasWord(lower, ['offer', 'offers', 'discount', 'discounts', 'coupon', 'promo', 'promotion'])) return offersReply(dest)
  if (dest && hasWord(lower, ['hotel', 'hotels', 'stay', 'accommodation', 'resort', 'resorts', 'room', 'rooms'])) return hotelsReply(dest)
  if (dest && hasWord(lower, ['attraction', 'attractions', 'visit', 'see', 'sightseeing', 'things to do', 'places', 'explore'])) return attractionsReply(dest)
  if (dest && hasWord(lower, ['weather', 'temperature', 'climate', 'season', 'best time', 'rain'])) return weatherReply(dest)

  const kb = matchKnowledge(lower)
  if (kb && !(dest && ['budget', 'destination'].includes(kb.topic))) return { topic: kb.topic, reply: kb.reply }
  if (dest) return destinationReply(dest)
  return { topic: 'fallback', reply: FALLBACK }
}

// POST /api/chatbot  { message }
const ask = asyncHandler(async (req, res) => {
  const { message } = req.body
  if (!message || !message.trim()) {
    res.status(400)
    throw new Error('Please type a message for the TravelMate Assistant.')
  }

  let result
  try {
    result = await answer(message.trim(), req.user)
  } catch (err) {
    console.error('Chatbot lookup failed:', err.message)
    result = { topic: 'fallback', reply: FALLBACK }
  }

  try {
    await ChatHistory.create({ user: req.user?._id || null, message, reply: result.reply, matchedTopic: result.topic })
  } catch {
    // Chat history is a nice-to-have — never fail the chatbot reply over a logging issue.
  }

  res.json({ success: true, reply: result.reply, topic: result.topic })
})

module.exports = { ask, answer }
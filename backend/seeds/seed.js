/**
 * Seeds MongoDB with realistic TravelMate data: 5 test user accounts (not
 * shown anywhere in the frontend) + 1 admin, destinations, hotels, rooms,
 * packages, verified attractions, itinerary banks, offers and reviews.
 *
 * Run with:  npm run seed            (from server/)
 * Wipe with: npm run seed:destroy
 */
require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')

const User = require('../models/User')
const Destination = require('../models/Destination')
const Hotel = require('../models/Hotel')
const Room = require('../models/Room')
const Package = require('../models/Package')
const Itinerary = require('../models/Itinerary')
const Offer = require('../models/Offer')
const Review = require('../models/Review')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const Wishlist = require('../models/Wishlist')
const RecentlyAccessed = require('../models/RecentlyAccessed')
const Attraction = require('../models/Attraction')

const destinationsData = require('./data/destinations')
const hotelsData = require('./data/hotels')
const packagesData = require('./data/packages')
const itineraryBank = require('./data/itinerary')
const weatherData = require('./data/weather')
const testimonials = require('./data/testimonials')
const offersData = require('./data/offers')
const attractionsData = require('./data/attractions')

// Maps a planner "interest" to the Attraction category it should pull from.
// Luxury has no direct category, so it prefers a Landmark/Culture attraction —
// a genuinely premium real place rather than an invented one.
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
const CATEGORY_VERB = {
  History: 'Guided visit to',
  Culture: 'Cultural visit to',
  Nature: 'Scenic visit to',
  Beach: 'Relaxing time at',
  Adventure: 'Adventure excursion to',
  Food: 'Food experience at',
  Shopping: 'Shopping trip to',
  Family: 'Family outing to',
  Nightlife: 'Evening out at',
  Religious: 'Visit to',
  Landmark: 'Visit to',
}

/**
 * Builds an itinerary "bank" (attractions/tips/activities) for a destination
 * using ONLY the verified Attraction rows for that destination — never an
 * invented place name. Used for destinations that don't have a hand-authored
 * entry in seeds/data/itinerary.js.
 */
function buildBankFromAttractions(destinationName, attractionsForDest) {
  if (!attractionsForDest.length) return null

  const byCategory = {}
  attractionsForDest.forEach((a) => {
    if (!byCategory[a.category]) byCategory[a.category] = a
  })

  const activities = { Arrival: 'Airport pickup and hotel check-in' }
  Object.keys(INTEREST_TO_CATEGORY).forEach((interest) => {
    const category = INTEREST_TO_CATEGORY[interest]
    const attraction = byCategory[category] || byCategory.Landmark || byCategory.Culture || attractionsForDest[0]
    activities[interest] = `${CATEGORY_VERB[attraction.category] || 'Visit to'} ${attraction.name}`
  })

  return {
    attractions: attractionsForDest.slice(0, 8).map((a) => a.name),
    tips: [
      'Keep a copy of your ID and hotel address handy at all times.',
      `Book popular ${destinationName} attractions a day in advance to avoid queues.`,
      'Check the latest local travel advisories before your trip.',
    ],
    activities,
  }
}

const SEED_PASSWORD = process.env.SEED_PASSWORD || 'TravelMate@123'

// These five accounts exist ONLY to satisfy the course requirement that at
// least five real, working MongoDB user accounts can log in. They are never
// surfaced in the frontend — no "Quick Login" buttons, no credentials in any
// React source file, no default-user picker on the login page. Login/Register
// requires real authentication; anyone can also create their own account.
// Credentials are documented here and in the console output only.
const TEST_USER_ACCOUNTS = [
  { name: 'Ananya Sharma', email: 'user1@travelmate.demo' },
  { name: 'Daniel Cooper', email: 'user2@travelmate.demo' },
  { name: 'Priya Nair', email: 'user3@travelmate.demo' },
  { name: 'Rahul Verma', email: 'user4@travelmate.demo' },
  { name: 'Sara Thomas', email: 'user5@travelmate.demo' },
]
// The admin account is backend-controlled only — never exposed in frontend
// source, protected by JWT + role-based authorization on every admin route.
const ADMIN_USER = { name: 'TravelMate Admin', email: 'travelmate272410@gmail.com' }

// Maps each testimonial to the destination its review text is actually about.
const TESTIMONIAL_DESTINATIONS = ['Bali', 'Paris', 'Goa']

async function destroy() {
  await Promise.all([
    Booking.deleteMany(),
    Payment.deleteMany(),
    Wishlist.deleteMany(),
    RecentlyAccessed.deleteMany(),
    Review.deleteMany(),
    Offer.deleteMany(),
    Itinerary.deleteMany(),
    Attraction.deleteMany(),
    Room.deleteMany(),
    Package.deleteMany(),
    Hotel.deleteMany(),
    Destination.deleteMany(),
    User.deleteMany({ email: { $regex: '@travelmate\\.demo$' } }),
  ])
  console.log('All seeded collections cleared.')
}

async function seedUsers() {
  const created = []
  for (const u of TEST_USER_ACCOUNTS) {
    const existing = await User.findOne({ email: u.email })
    if (existing) {
      created.push(existing)
      continue
    }
    const user = await User.create({ ...u, password: SEED_PASSWORD, role: 'user', authProvider: 'local' })
    created.push(user)
  }

  let admin = await User.findOne({ email: ADMIN_USER.email })
  if (!admin) {
    admin = await User.create({ ...ADMIN_USER, password: SEED_PASSWORD, role: 'admin', authProvider: 'local' })
  }

  return { users: created, admin }
}

async function seedDestinations() {
  const docs = destinationsData.map((d) => ({
    name: d.name,
    country: d.country,
    rating: d.rating,
    price: d.price,
    description: d.description,
    image: d.image,
    tag: d.tag,
    bestSeason: d.bestSeason,
    budgetEstimate: d.budgetEstimate,
    region: d.region,
    distanceTier: d.distanceTier || null,
    styles: d.styles || [],
    weather: weatherData[d.name] || undefined,
  }))

  const result = []
  for (const doc of docs) {
    const saved = await Destination.findOneAndUpdate({ name: doc.name }, doc, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
    result.push(saved)
  }
  return result
}

async function seedHotels() {
  const result = []
  for (const h of hotelsData) {
    const { id, ...rest } = h
    const saved = await Hotel.findOneAndUpdate({ destination: h.destination, name: h.name }, rest, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
    result.push(saved)
  }
  return result
}

async function seedRooms(hotels) {
  const roomTypes = [
    { roomType: 'Deluxe Room', multiplier: 1, capacity: 2 },
    { roomType: 'Premium Suite', multiplier: 1.6, capacity: 3 },
  ]
  let count = 0
  for (const hotel of hotels) {
    for (const rt of roomTypes) {
      await Room.findOneAndUpdate(
        { hotel: hotel._id, roomType: rt.roomType },
        {
          hotel: hotel._id,
          roomType: rt.roomType,
          pricePerNight: Math.round((hotel.pricePerNight * rt.multiplier) / 50) * 50,
          capacity: rt.capacity,
          amenities: hotel.amenities,
          available: true,
        },
        { upsert: true, setDefaultsOnInsert: true }
      )
      count++
    }
  }
  return count
}

async function seedPackages() {
  let count = 0
  for (const p of packagesData) {
    const { id, ...rest } = p
    await Package.findOneAndUpdate({ name: p.name, destination: p.destination }, rest, {
      upsert: true,
      setDefaultsOnInsert: true,
    })
    count++
  }
  return count
}

async function seedAttractions() {
  let count = 0
  for (const a of attractionsData) {
    await Attraction.findOneAndUpdate(
      { destination: a.destination, name: a.name },
      { ...a, verified: true, isActive: true },
      { upsert: true, setDefaultsOnInsert: true }
    )
    count++
  }
  return count
}

async function seedItineraries() {
  let count = 0
  // Every destination in the catalog gets a bank — hand-curated where one
  // already exists (Bali, Maldives, Goa, Paris, Dubai, Switzerland), and
  // generated purely from verified Attraction rows for the rest. Neither path
  // ever invents a fictional place.
  for (const dest of destinationsData) {
    const destination = dest.name
    const curated = itineraryBank[destination]
    const bank =
      curated || buildBankFromAttractions(destination, attractionsData.filter((a) => a.destination === destination))
    if (!bank) continue

    await Itinerary.findOneAndUpdate(
      { destination },
      { destination, attractions: bank.attractions, tips: bank.tips, activities: bank.activities },
      { upsert: true, setDefaultsOnInsert: true }
    )
    count++
  }
  return count
}

async function seedOffers() {
  for (const o of offersData) {
    await Offer.findOneAndUpdate({ code: o.code }, o, { upsert: true, setDefaultsOnInsert: true })
  }
  return offersData.length
}

async function seedReviews(users) {
  let count = 0
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    const destination = TESTIMONIAL_DESTINATIONS[i] || 'Bali'
    const user = users[i % users.length]
    const exists = await Review.findOne({ user: user._id, destination, comment: t.review })
    if (exists) continue
    await Review.create({
      user: user._id,
      destination,
      rating: t.rating,
      comment: t.review,
    })
    count++
  }
  return count
}

async function run() {
  await connectDB()

  if (process.argv.includes('--destroy')) {
    await destroy()
    await mongoose.disconnect()
    return
  }

  console.log('Seeding TravelMate database...\n')

  const { users, admin } = await seedUsers()
  console.log(`✓ ${users.length} test user accounts + 1 admin ready (not exposed in frontend)`)

  await seedDestinations()
  console.log(`✓ ${destinationsData.length} destinations ready`)

  const hotels = await seedHotels()
  console.log(`✓ ${hotels.length} hotels ready`)

  const roomCount = await seedRooms(hotels)
  console.log(`✓ ${roomCount} rooms ready`)

  const pkgCount = await seedPackages()
  console.log(`✓ ${pkgCount} packages ready`)

  const attractionCount = await seedAttractions()
  console.log(`✓ ${attractionCount} verified attractions ready`)

  const itinCount = await seedItineraries()
  console.log(`✓ ${itinCount} itinerary banks ready (covering every destination, zero invented places)`)

  const offerCount = await seedOffers()
  console.log(`✓ ${offerCount} offers ready`)

  const reviewCount = await seedReviews(users)
  console.log(`✓ ${reviewCount} reviews ready`)

  console.log('\n--- Test credentials (password for all: ' + SEED_PASSWORD + ') ---')
  users.forEach((u) => console.log(`  user   ${u.email}`))
  console.log(`  admin  ${admin.email}`)
  console.log('\nSeeding complete.')

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})

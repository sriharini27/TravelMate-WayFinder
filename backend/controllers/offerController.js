const asyncHandler = require('express-async-handler')
const Offer = require('../models/Offer')
const crudFactory = require('./crudFactory')

const base = crudFactory(Offer, { searchFields: ['title', 'code', 'destination'] })

/**
 * GET /api/offers/applicable
 *
 * Returns only the offers that genuinely apply to a given trip — matching
 * BOTH the destination AND at least one itinerary/activity category, never
 * a destination-only match. This is the single source of truth for "which
 * offers can this trip use", called before payment (BookingModal) so the
 * person is only ever shown relevant offers, and never applies one that
 * doesn't actually fit their trip.
 *
 * Query params:
 *   destination   - trip destination (required for a destination match;
 *                    offers with destination:'' still apply to everyone)
 *   categories    - comma-separated itinerary/activity categories for this
 *                    trip (e.g. "Adventure,Nature") — reuses the same
 *                    Attraction.category vocabulary the itinerary generator
 *                    already uses
 *   totalAmount   - the trip's pre-discount total, to enforce minimumAmount
 */
const getApplicable = asyncHandler(async (req, res) => {
  const destination = (req.query.destination || '').trim()
  const categories = (req.query.categories || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const totalAmount = Number(req.query.totalAmount) || 0
  const now = new Date()

  // Base filter: active and within its validity window. Destination and
  // category matching (below) stay in JS since they both need the
  // destination:''/applicableCategories:[] "applies to everyone" fallback
  // behavior, which is simpler to express as a filter than as a query.
  const candidates = await Offer.find({
    active: true,
    validTill: { $gte: now },
    $or: [{ validFrom: null }, { validFrom: { $lte: now } }],
  })

  const matching = candidates.filter((offer) => {
    const destinationOk = !offer.destination || offer.destination === destination
    const categoryOk =
      !offer.applicableCategories ||
      offer.applicableCategories.length === 0 ||
      offer.applicableCategories.some((c) => categories.includes(c))
    const minAmountOk = !offer.minimumAmount || totalAmount >= offer.minimumAmount
    return destinationOk && categoryOk && minAmountOk
  })

  res.json({ success: true, count: matching.length, items: matching })
})

module.exports = { ...base, getApplicable }

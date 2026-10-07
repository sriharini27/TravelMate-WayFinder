const asyncHandler = require('express-async-handler')
const Payment = require('../models/Payment')
const Booking = require('../models/Booking')
const Offer = require('../models/Offer')
const { generateBookingId, generatePaymentId } = require('../utils/generateIds')

/**
 * Re-derives the discount server-side from the Offer record itself (never
 * trusting a client-computed discount/final amount), so the amount actually
 * charged — and therefore every admin payment statistic — always reflects a
 * real, currently-active offer rather than whatever the frontend sent.
 */
async function resolveOfferDiscount(originalAmount, offerSelection) {
  const none = { offer: null, discountPercent: 0, discountAmount: 0, finalAmount: originalAmount }
  if (!offerSelection || !offerSelection.offerId) return none

  const offer = await Offer.findById(offerSelection.offerId)
  const now = new Date()
  if (
    !offer ||
    !offer.active ||
    offer.validTill < now ||
    (offer.validFrom && offer.validFrom > now) ||
    (offer.minimumAmount && originalAmount < offer.minimumAmount)
  ) {
    return none
  }

  const discountPercent = offer.discountPercent || 0
  const discountAmount = Math.round((originalAmount * discountPercent) / 100)
  const finalAmount = Math.max(0, originalAmount - discountAmount)
  return { offer, discountPercent, discountAmount, finalAmount }
}

/**
 * POST /api/payments/simulate
 *
 * This is a frontend-only DEMO payment simulator — nothing here talks to a
 * real bank, UPI network or card processor. The client tells the server
 * which outcome the person clicked ("Simulate Successful/Failed/Pending
 * Payment"); the server's only job is to record that outcome and — ONLY on
 * a simulated success — create the confirmed booking in the same request,
 * so a booking can never exist without a matching successful payment record.
 *
 * body: { amount, paymentMethod, outcome: 'success' | 'failed' | 'pending', bookingDraft }
 * bookingDraft (required when outcome === 'success'): the full trip + booking
 * details the client already assembled (destination, hotel, itinerary, budget, etc.)
 */
const simulatePayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethod = 'UPI', outcome, bookingDraft, offer: offerSelection = null } = req.body

  if (!amount || !['success', 'failed', 'pending'].includes(outcome)) {
    res.status(400)
    throw new Error('A valid amount and outcome are required.')
  }

  // The trip's pre-discount total, when we have it, is the basis for the
  // server-verified discount below. Falls back to the client-sent amount
  // only when no trip/offer context is available (e.g. no offer selected).
  const originalAmount = bookingDraft?.trip?.budget?.total ?? amount
  const { offer, discountPercent, discountAmount, finalAmount } = await resolveOfferDiscount(
    originalAmount,
    offerSelection
  )
  // The amount actually charged — and the only figure ever persisted below —
  // is always this server-verified final amount, never the raw client value.
  const chargedAmount = offerSelection?.offerId ? finalAmount : amount

  const paymentId = generatePaymentId()
  const paymentStatus = outcome === 'success' ? 'Successful' : outcome === 'failed' ? 'Failed' : 'Pending'

  const payment = await Payment.create({
    paymentId,
    user: req.user._id,
    amount: chargedAmount,
    paymentMethod,
    paymentStatus,
    isDemo: true,
  })

  if (outcome !== 'success') {
    return res.json({ success: true, payment, booking: null })
  }

  if (!bookingDraft || !bookingDraft.trip || !bookingDraft.trip.itinerary) {
    res.status(400)
    throw new Error('Missing trip details — cannot create a booking for a successful payment.')
  }

  const { trip, pkg = null, travelDate = '', travellers = 1 } = bookingDraft
  const bookingId = generateBookingId()
  const checkInDate = travelDate || ''
  const checkOutDate = travelDate
    ? new Date(new Date(travelDate).getTime() + (trip.itinerary.length - 1) * 86400000).toISOString().slice(0, 10)
    : ''

  const dailyCheckins = trip.itinerary.map((d) => ({
    day: d.day,
    date: checkInDate
      ? new Date(new Date(checkInDate).getTime() + (d.day - 1) * 86400000).toISOString().slice(0, 10)
      : '',
    checkedIn: false,
    checkedInAt: null,
  }))

  const booking = await Booking.create({
    user: req.user._id,
    bookingId,
    destination: trip.destination,
    sourceCity: trip.sourceCity || '',
    package: pkg ? { id: pkg.id, name: pkg.name } : { id: null, name: null },
    hotel: trip.hotel,
    checkInDate,
    checkOutDate,
    travellers: travellers || 1,
    arrivalTime: trip.arrivalStrategy?.arrivalTime || '',
    arrivalStrategy: trip.arrivalStrategy ? trip.arrivalStrategy.label : 'Standard Check-in',
    earlyCheckinFee: trip.budget.earlyCheckinFee || 0,
    // Both of these reflect the FINAL, discount-applied amount whenever an
    // offer was used — never the original pre-discount trip total.
    totalAmount: chargedAmount,
    offerId: offer ? offer._id : null,
    offerCode: offer ? offer.code : '',
    discountPercent: offer ? discountPercent : 0,
    discountAmount: offer ? discountAmount : 0,
    originalAmount,
    finalAmount: chargedAmount,
    bookingStatus: 'Upcoming',
    bookingDate: new Date(),
    paymentMethod,
    paymentStatus: 'Successful',
    paymentId,
    amountPaid: chargedAmount,
    bookingConfirmationStatus: 'Confirmed',
    arrivalConfirmed: false,
    arrivalConfirmedAt: null,
    dailyCheckins,
    tripCompleted: false,
    trip,
  })

  payment.booking = booking._id
  await payment.save()

  res.status(201).json({ success: true, payment, booking })
})

// GET /api/payments/my
const myPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort('-createdAt')
  res.json({ success: true, items: payments })
})

// GET /api/payments — admin only
const allPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort('-createdAt').limit(500).populate('user', 'name email')
  res.json({ success: true, items: payments })
})

module.exports = { simulatePayment, myPayments, allPayments }

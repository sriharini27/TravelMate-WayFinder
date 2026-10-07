const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const dailyCheckinSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: String, default: '' },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
  },
  { _id: false }
)

// Mirrors the booking object shape the existing frontend already works with
// (BookingsContext, TripCard, MyTrips) so very little UI code needed to change.
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookingId: { type: String, required: true, unique: true }, // TM-BOOK-XXXXXXXX
    destination: { type: String, required: true },
    sourceCity: { type: String, default: '' },
    package: {
      id: { type: String, default: null },
      name: { type: String, default: null },
    },
    hotel: { type: mongoose.Schema.Types.Mixed, required: true },
    checkInDate: { type: String, default: '' },
    checkOutDate: { type: String, default: '' },
    travellers: { type: Number, default: 1 },
    arrivalTime: { type: String, default: '' },
    arrivalStrategy: { type: String, default: 'Standard Check-in' },
    earlyCheckinFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Offer applied at booking time, if any — the booking is created with
    // the FINAL discounted amount already reflected in totalAmount/amountPaid
    // below; these fields just record what produced that discount.
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', default: null },
    offerCode: { type: String, default: '' },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    originalAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },

    // Trip status track — drives My Trips tabs (unchanged from the original app).
    bookingStatus: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    bookingDate: { type: Date, default: Date.now },

    // Payment status track
    paymentMethod: { type: String, default: 'UPI' },
    paymentStatus: { type: String, enum: ['Successful', 'Failed', 'Pending'], default: 'Successful' },
    paymentId: { type: String, default: null },
    amountPaid: { type: Number, default: 0 },

    // Booking confirmation status track
    bookingConfirmationStatus: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },

    arrivalConfirmed: { type: Boolean, default: false },
    arrivalConfirmedAt: { type: Date, default: null },
    dailyCheckins: { type: [dailyCheckinSchema], default: [] },
    tripCompleted: { type: Boolean, default: false },

    // Email ticket delivery — tracked separately from booking/payment status so
    // an SMTP failure can never invalidate an already-confirmed booking.
    emailStatus: { type: String, enum: ['NotAttempted', 'Sent', 'Failed'], default: 'NotAttempted' },
    emailError: { type: String, default: '' },
    emailSentAt: { type: Date, default: null },

    // Full generated trip (itinerary, budget breakdown, weather, attractions, tips) —
    // produced client-side by the existing deterministic AI planner, stored as-is.
    trip: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

applyToJSON(bookingSchema)

module.exports = mongoose.model('Booking', bookingSchema)

const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

// A standalone payment record (TM-PAY-XXXXXXXX), kept alongside the fields
// already copied onto Booking so admin reporting can query payments directly.
const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['UPI', 'Card', 'NetBanking'], default: 'UPI' },
    paymentStatus: { type: String, enum: ['Successful', 'Failed', 'Pending'], required: true },
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

applyToJSON(paymentSchema)

module.exports = mongoose.model('Payment', paymentSchema)

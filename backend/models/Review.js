const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true, index: true },
    package: { type: String, default: null },
    hotel: { type: String, default: null },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

applyToJSON(reviewSchema)

module.exports = mongoose.model('Review', reviewSchema)

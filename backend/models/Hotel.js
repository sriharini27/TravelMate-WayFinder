const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const hotelSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true, index: true }, // destination name
    name: { type: String, required: true },
    rating: { type: Number, default: 4.3 },
    pricePerNight: { type: Number, required: true },
    distanceFromCenter: { type: String, default: '' },
    image: { type: String, required: true },
    amenities: { type: [String], default: [] },
    standardCheckIn: { type: String, default: '12:00 PM' },
    standardCheckOut: { type: String, default: '11:00 AM' },
    earlyCheckinAvailable: { type: Boolean, default: false },
    earlyCheckinFee: { type: Number, default: 0 },
  },
  { timestamps: true }
)

applyToJSON(hotelSchema)

module.exports = mongoose.model('Hotel', hotelSchema)

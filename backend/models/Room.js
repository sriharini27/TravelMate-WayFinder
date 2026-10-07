const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

// Lightweight room inventory per hotel — supports the "Room" collection the
// course spec asks for without changing the existing booking flow, which
// books a hotel as a whole (matching the original frontend's design).
const roomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: String, required: true }, // e.g. Deluxe, Suite, Villa
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, default: 2 },
    amenities: { type: [String], default: [] },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
)

applyToJSON(roomSchema)

module.exports = mongoose.model('Room', roomSchema)

const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    country: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    price: { type: Number, required: true }, // indicative per-person price, used by cards
    description: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, default: '' },
    bestSeason: { type: String, default: '' },
    budgetEstimate: { type: String, default: '' },
    region: { type: String, default: 'International' }, // North/South/East/West/Central or International
    distanceTier: { type: String, enum: ['Near', 'Mid', 'Far', null], default: null },
    styles: { type: [String], default: [] },
    // The attractions/tips/activity "bank" used by the AI planner lives in the
    // separate Itinerary collection (one doc per destination name) — see models/Itinerary.js.
    weather: {
      temperature: Number,
      condition: String,
      humidity: Number,
      wind: String,
      recommendation: String,
    },
  },
  { timestamps: true }
)

applyToJSON(destinationSchema)

module.exports = mongoose.model('Destination', destinationSchema)

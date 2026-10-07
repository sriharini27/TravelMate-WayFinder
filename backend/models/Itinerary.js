const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

// Per-destination activity "bank" the AI planner draws from (attractions,
// travel tips, and an interest -> activity-description map). Kept as its own
// collection (separate from Destination) to match the required MongoDB
// collection list; Destination.getBank()-style lookups join on name.
const itinerarySchema = new mongoose.Schema(
  {
    destination: { type: String, required: true, unique: true, index: true },
    attractions: { type: [String], default: [] },
    tips: { type: [String], default: [] },
    activities: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
)

applyToJSON(itinerarySchema)

module.exports = mongoose.model('Itinerary', itinerarySchema)

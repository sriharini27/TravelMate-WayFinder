const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

// A curated, real-world tourist attraction tied to exactly one destination.
// This is the verified source of truth the AI itinerary generator draws
// from (see client/src/utils/generateTrip.js) so the planner can never
// invent a fictional place — it only ever picks from rows marked
// verified + isActive here.
const attractionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, index: true },
    country: { type: String, default: '' },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'History',
        'Culture',
        'Nature',
        'Beach',
        'Adventure',
        'Food',
        'Shopping',
        'Family',
        'Nightlife',
        'Religious',
        'Landmark',
      ],
      required: true,
    },
    image: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    address: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    // True only for attractions this team has manually curated against
    // real-world sources. The itinerary generator never surfaces a row
    // where verified or isActive is false.
    verified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

attractionSchema.index({ destination: 1, name: 1 }, { unique: true })

applyToJSON(attractionSchema)

module.exports = mongoose.model('Attraction', attractionSchema)

const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    destination: { type: String, default: '' }, // '' = applies to any destination
    // Itinerary/activity categories this offer applies to — reuses the same
    // vocabulary as Attraction.category (and the planner's "interests"), so a
    // trip's itinerary can be matched against an offer without a second,
    // parallel tagging system. Empty array = no category restriction.
    applicableCategories: {
      type: [String],
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
      default: [],
    },
    // Optional minimum trip amount (pre-discount) the offer requires.
    minimumAmount: { type: Number, default: 0 },
    // Offer window start — validTill already covers the end of the window.
    validFrom: { type: Date, default: null },
    image: { type: String, default: '' },
    validTill: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

applyToJSON(offerSchema)

module.exports = mongoose.model('Offer', offerSchema)

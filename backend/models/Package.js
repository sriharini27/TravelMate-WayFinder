const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const dayWiseSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: { type: [String], default: [] },
  },
  { _id: false }
)

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true, index: true },
    days: { type: Number, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    transportation: { type: String, default: '' },
    dayWise: { type: [dayWiseSchema], default: [] },
    availableDates: { type: [String], default: [] },
  },
  { timestamps: true }
)

applyToJSON(packageSchema)

module.exports = mongoose.model('Package', packageSchema)

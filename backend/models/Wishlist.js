const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceType: { type: String, enum: ['destination', 'hotel', 'package'], required: true },
    resourceId: { type: String, required: true }, // destination name, or hotel/package Mongo _id string
    resourceName: { type: String, required: true },
    resourceImage: { type: String, default: '' },
  },
  { timestamps: true }
)

wishlistSchema.index({ user: 1, resourceType: 1, resourceId: 1 }, { unique: true })

applyToJSON(wishlistSchema)

module.exports = mongoose.model('Wishlist', wishlistSchema)

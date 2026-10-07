const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

const recentlyAccessedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceType: { type: String, enum: ['destination', 'hotel', 'package'], required: true },
    resourceId: { type: String, required: true },
    resourceName: { type: String, required: true },
    resourceImage: { type: String, default: '' },
    accessedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

// One row per (user, resource) — re-viewing just bumps accessedAt instead of growing forever.
recentlyAccessedSchema.index({ user: 1, resourceType: 1, resourceId: 1 }, { unique: true })

applyToJSON(recentlyAccessedSchema)

module.exports = mongoose.model('RecentlyAccessed', recentlyAccessedSchema)

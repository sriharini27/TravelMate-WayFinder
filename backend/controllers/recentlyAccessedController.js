const asyncHandler = require('express-async-handler')
const RecentlyAccessed = require('../models/RecentlyAccessed')

const MAX_RECENT = 10

// POST /api/recently-accessed  { resourceType, resourceId, resourceName, resourceImage }
const recordAccess = asyncHandler(async (req, res) => {
  const { resourceType, resourceId, resourceName, resourceImage = '' } = req.body
  if (!resourceType || !resourceId || !resourceName) {
    res.status(400)
    throw new Error('resourceType, resourceId and resourceName are required.')
  }

  const item = await RecentlyAccessed.findOneAndUpdate(
    { user: req.user._id, resourceType, resourceId },
    { resourceName, resourceImage, accessedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  res.json({ success: true, item })
})

// GET /api/recently-accessed?type=destination
const getRecentlyAccessed = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }
  if (req.query.type) filter.resourceType = req.query.type

  const items = await RecentlyAccessed.find(filter).sort('-accessedAt').limit(MAX_RECENT)
  res.json({ success: true, items })
})

module.exports = { recordAccess, getRecentlyAccessed }

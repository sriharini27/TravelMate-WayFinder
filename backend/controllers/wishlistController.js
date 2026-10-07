const asyncHandler = require('express-async-handler')
const Wishlist = require('../models/Wishlist')

// GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id }).sort('-createdAt')
  res.json({ success: true, items })
})

// POST /api/wishlist  { resourceType, resourceId, resourceName, resourceImage }
const addToWishlist = asyncHandler(async (req, res) => {
  const { resourceType, resourceId, resourceName, resourceImage = '' } = req.body
  if (!resourceType || !resourceId || !resourceName) {
    res.status(400)
    throw new Error('resourceType, resourceId and resourceName are required.')
  }

  const item = await Wishlist.findOneAndUpdate(
    { user: req.user._id, resourceType, resourceId },
    { resourceName, resourceImage },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  res.status(201).json({ success: true, item })
})

// DELETE /api/wishlist/:id
const removeFromWishlist = asyncHandler(async (req, res) => {
  const item = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!item) {
    res.status(404)
    throw new Error('Wishlist item not found.')
  }
  res.json({ success: true, message: 'Removed from wishlist.' })
})

module.exports = { getWishlist, addToWishlist, removeFromWishlist }

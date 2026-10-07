const asyncHandler = require('express-async-handler')
const Review = require('../models/Review')

// GET /api/reviews?destination=Bali
const listReviews = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.destination) filter.destination = req.query.destination
  const reviews = await Review.find(filter).sort('-createdAt').limit(100).populate('user', 'name profileImage')
  res.json({ success: true, items: reviews })
})

// GET /api/reviews/featured — top-rated reviews for the homepage testimonials section
const featuredReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ rating: { $gte: 4 } })
    .sort('-rating -createdAt')
    .limit(6)
    .populate('user', 'name profileImage')
  res.json({ success: true, items: reviews })
})

// POST /api/reviews  { destination, package, hotel, booking, rating, comment }
const createReview = asyncHandler(async (req, res) => {
  const { destination, package: pkg, hotel, booking, rating, comment } = req.body
  if (!destination || !rating || !comment) {
    res.status(400)
    throw new Error('destination, rating and comment are required.')
  }
  const review = await Review.create({
    user: req.user._id,
    destination,
    package: pkg || null,
    hotel: hotel || null,
    booking: booking || null,
    rating,
    comment,
  })
  res.status(201).json({ success: true, item: review })
})

// DELETE /api/reviews/:id — owner or admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    res.status(404)
    throw new Error('Review not found.')
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403)
    throw new Error('You cannot delete this review.')
  }
  await review.deleteOne()
  res.json({ success: true, message: 'Review deleted.' })
})

module.exports = { listReviews, featuredReviews, createReview, deleteReview }

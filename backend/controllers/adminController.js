const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const Destination = require('../models/Destination')

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalBookings, confirmedBookings, cancelledBookings, completedTrips, payments, recentUsers, recentBookings] =
    await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingConfirmationStatus: 'Confirmed' }),
      Booking.countDocuments({ bookingStatus: 'Cancelled' }),
      Booking.countDocuments({ bookingStatus: 'Completed' }),
      Payment.find({ paymentStatus: 'Successful' }),
      User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
      Booking.find().sort('-createdAt').limit(5).populate('user', 'name email'),
    ])

  const paymentTotal = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  const popularAgg = await Booking.aggregate([
    { $group: { _id: '$destination', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ])

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedTrips,
      paymentTotal,
      totalDestinations: await Destination.countDocuments(),
      popularDestinations: popularAgg.map((p) => ({ destination: p._id, bookings: p.count })),
      recentUsers,
      recentBookings,
    },
  })
})

// GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt').limit(200)
  res.json({ success: true, items: users.map((u) => u.toSafeJSON()) })
})

// PUT /api/admin/users/:id/role  { role }
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) {
    res.status(400)
    throw new Error('role must be "user" or "admin".')
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
  if (!user) {
    res.status(404)
    throw new Error('User not found.')
  }
  res.json({ success: true, item: user.toSafeJSON() })
})

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400)
    throw new Error('You cannot delete your own admin account.')
  }
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found.')
  }
  res.json({ success: true, message: 'User deleted.' })
})

module.exports = { getStats, listUsers, updateUserRole, deleteUser }

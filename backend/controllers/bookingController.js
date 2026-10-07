const asyncHandler = require('express-async-handler')
const Booking = require('../models/Booking')
const User = require('../models/User')
const generateTicketPdf = require('../utils/generateTicketPdf')
const { isEmailConfigured, sendTicketEmail } = require('../services/emailService')

function ownsBookingOrAdmin(booking, user) {
  return booking.user.toString() === user._id.toString() || user.role === 'admin'
}

/** "sriharini@gmail.com" -> "s****@gmail.com" — never shown in full in the UI. */
function maskEmail(email) {
  const [local, domain] = String(email).split('@')
  if (!domain) return '****'
  const masked = local.length <= 1 ? '*' : local[0] + '*'.repeat(Math.max(3, local.length - 1))
  return `${masked}@${domain}`
}

// GET /api/bookings/my
const myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort('-createdAt')
  res.json({ success: true, count: bookings.length, items: bookings })
})

// GET /api/bookings/:id
const getBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findOne({ bookingId: req.params.id })
  if (!booking) {
    booking = await Booking.findById(req.params.id).catch(() => null)
  }
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  if (!ownsBookingOrAdmin(booking, req.user)) {
    res.status(403)
    throw new Error('You do not have access to this booking.')
  }
  res.json({ success: true, item: booking })
})

// PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  if (!ownsBookingOrAdmin(booking, req.user)) {
    res.status(403)
    throw new Error('You do not have access to this booking.')
  }
  booking.bookingStatus = 'Cancelled'
  booking.bookingConfirmationStatus = 'Cancelled'
  await booking.save()
  res.json({ success: true, item: booking })
})

// PUT /api/bookings/:id/confirm-arrival
const confirmArrival = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  if (!ownsBookingOrAdmin(booking, req.user)) {
    res.status(403)
    throw new Error('You do not have access to this booking.')
  }
  if (booking.bookingStatus === 'Cancelled') {
    res.status(400)
    throw new Error('This booking has been cancelled.')
  }
  booking.arrivalConfirmed = true
  booking.arrivalConfirmedAt = new Date()
  booking.bookingStatus = 'Ongoing'
  await booking.save()
  res.json({ success: true, item: booking })
})

// PUT /api/bookings/:id/check-in-day  { day }
const checkInDay = asyncHandler(async (req, res) => {
  const { day } = req.body
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  if (!ownsBookingOrAdmin(booking, req.user)) {
    res.status(403)
    throw new Error('You do not have access to this booking.')
  }
  // Guard: a cancelled trip can never be marked as explored further.
  if (booking.bookingStatus === 'Cancelled') {
    res.status(400)
    throw new Error('This booking has been cancelled — days can no longer be marked explored.')
  }

  booking.dailyCheckins = booking.dailyCheckins.map((c) =>
    c.day === Number(day) ? { ...c.toObject(), checkedIn: true, checkedInAt: new Date() } : c
  )
  const allDone = booking.dailyCheckins.every((c) => c.checkedIn)
  booking.tripCompleted = allDone
  // Partial completion never changes status away from Upcoming/Ongoing.
  if (allDone) booking.bookingStatus = 'Completed'

  await booking.save()
  res.json({ success: true, item: booking })
})

// DELETE /api/bookings/:id — admin only (route-protected)
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  res.json({ success: true, message: 'Booking deleted.' })
})

// GET /api/bookings — admin only, all bookings
const allBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort('-createdAt').limit(500).populate('user', 'name email')
  res.json({ success: true, count: bookings.length, items: bookings })
})

// GET /api/bookings/:id/ticket — streams a real backend-generated PDF ticket.
// Pure download, no email side effect.
const downloadTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  if (!ownsBookingOrAdmin(booking, req.user)) {
    res.status(403)
    throw new Error('You do not have access to this booking.')
  }

  const user = booking.user.toString() === req.user._id.toString() ? req.user : await User.findById(booking.user)
  const pdfBuffer = await generateTicketPdf(booking, user)

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="TravelMate-Ticket-${booking.bookingId}.pdf"`,
    'Content-Length': pdfBuffer.length,
  })
  res.send(pdfBuffer)
})

// POST /api/bookings/:id/send-ticket — generates the same PDF and emails it to
// the user's REGISTERED MongoDB email. Never fails the booking itself — a
// bad SMTP config or transient send failure is recorded on the booking and
// reported back as a non-fatal error so the frontend can offer a retry.
const sendTicketEmail_ = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found.')
  }
  if (!ownsBookingOrAdmin(booking, req.user)) {
    res.status(403)
    throw new Error('You do not have access to this booking.')
  }
  if (booking.bookingConfirmationStatus !== 'Confirmed' || booking.paymentStatus !== 'Successful') {
    res.status(400)
    throw new Error('Tickets can only be emailed for a confirmed, successfully paid booking.')
  }

  const user = booking.user.toString() === req.user._id.toString() ? req.user : await User.findById(booking.user)

  // Avoid re-sending within a short window if the button is clicked repeatedly.
  if (booking.emailStatus === 'Sent' && booking.emailSentAt && Date.now() - booking.emailSentAt.getTime() < 60_000) {
    return res.json({ success: true, emailStatus: 'Sent', maskedEmail: maskEmail(user.email), message: 'Ticket already sent to your registered email.' })
  }

  if (!isEmailConfigured()) {
    booking.emailStatus = 'Failed'
    booking.emailError = 'Email is not configured on this server.'
    await booking.save()
    return res.json({
      success: false,
      emailStatus: 'Failed',
      maskedEmail: maskEmail(user.email),
      message: 'Ticket downloaded successfully, but email delivery failed. Please try again.',
    })
  }

  try {
    const pdfBuffer = await generateTicketPdf(booking, user)
    await sendTicketEmail({ booking, user, pdfBuffer })
    booking.emailStatus = 'Sent'
    booking.emailError = ''
    booking.emailSentAt = new Date()
    await booking.save()
    res.json({ success: true, emailStatus: 'Sent', maskedEmail: maskEmail(user.email), message: 'Ticket sent to your registered email.' })
  } catch (err) {
    booking.emailStatus = 'Failed'
    booking.emailError = err.message
    await booking.save()
    res.json({
      success: false,
      emailStatus: 'Failed',
      maskedEmail: maskEmail(user.email),
      message: 'Ticket downloaded successfully, but email delivery failed. Please try again.',
    })
  }
})

module.exports = {
  myBookings,
  getBooking,
  cancelBooking,
  confirmArrival,
  checkInDay,
  deleteBooking,
  allBookings,
  downloadTicket,
  sendTicketEmail: sendTicketEmail_,
}

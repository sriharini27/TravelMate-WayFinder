const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/bookingController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)

router.get('/my', ctrl.myBookings)
router.get('/', adminOnly, ctrl.allBookings)
router.get('/:id', ctrl.getBooking)
router.put('/:id/cancel', ctrl.cancelBooking)
router.put('/:id/confirm-arrival', ctrl.confirmArrival)
router.put('/:id/check-in-day', ctrl.checkInDay)
router.get('/:id/ticket', ctrl.downloadTicket)
router.post('/:id/send-ticket', ctrl.sendTicketEmail)
router.delete('/:id', adminOnly, ctrl.deleteBooking)

module.exports = router

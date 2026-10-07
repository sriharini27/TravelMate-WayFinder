const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/paymentController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)

router.post('/simulate', ctrl.simulatePayment)
router.get('/my', ctrl.myPayments)
router.get('/', adminOnly, ctrl.allPayments)

module.exports = router

const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/reviewController')
const { protect } = require('../middleware/auth')

router.get('/', ctrl.listReviews)
router.get('/featured', ctrl.featuredReviews)
router.post('/', protect, ctrl.createReview)
router.delete('/:id', protect, ctrl.deleteReview)

module.exports = router

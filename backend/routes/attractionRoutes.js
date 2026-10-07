const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/attractionController')
const { protect, adminOnly } = require('../middleware/auth')

// Public, read-only — same pattern as destinations/hotels/packages.
router.get('/', ctrl.list)
router.get('/by-destination/:name', ctrl.getByDestination)
router.get('/:id', ctrl.getOne)

// Admin-only mutation, so the verified attraction database stays curated.
router.post('/', protect, adminOnly, ctrl.create)
router.put('/:id', protect, adminOnly, ctrl.update)
router.delete('/:id', protect, adminOnly, ctrl.remove)

module.exports = router

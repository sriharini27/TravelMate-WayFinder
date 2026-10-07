const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/destinationController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', ctrl.list)
router.get('/by-name/:name', ctrl.getByName)
router.get('/:id', ctrl.getOne)
router.post('/', protect, adminOnly, ctrl.create)
router.put('/:id', protect, adminOnly, ctrl.update)
router.delete('/:id', protect, adminOnly, ctrl.remove)

module.exports = router

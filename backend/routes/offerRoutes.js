const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/offerController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', ctrl.list)
router.get('/applicable', ctrl.getApplicable)
router.get('/:id', ctrl.getOne)
router.post('/', protect, adminOnly, ctrl.create)
router.put('/:id', protect, adminOnly, ctrl.update)
router.delete('/:id', protect, adminOnly, ctrl.remove)

module.exports = router

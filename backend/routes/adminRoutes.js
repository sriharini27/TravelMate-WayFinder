const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect, adminOnly)

router.get('/stats', ctrl.getStats)
router.get('/users', ctrl.listUsers)
router.put('/users/:id/role', ctrl.updateUserRole)
router.delete('/users/:id', ctrl.deleteUser)

module.exports = router

const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/userController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.put('/me', ctrl.updateProfile)

module.exports = router

const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/chatbotController')
const { optionalAuth } = require('../middleware/auth')

router.post('/', optionalAuth, ctrl.ask)

module.exports = router

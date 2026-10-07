const express = require('express')
const passport = require('passport')
const router = express.Router()
const { register, login, refresh, logout, me, googleCallback } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', protect, me)

// Google OAuth — redirect flow (GET, not POST, because the browser navigates here directly)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || '/'}/login?oauth=failed` }),
  googleCallback
)

module.exports = router

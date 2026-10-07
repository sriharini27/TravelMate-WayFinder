const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} = require('../utils/tokens')

async function issueSession(res, user) {
  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  const hashed = await bcrypt.hash(refreshToken, 8)
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), hashed] // keep last 5 sessions
  user.lastLoginAt = new Date()
  await user.save()

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions())
  return accessToken
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, preferences } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email and password are all required.')
  }
  if (password.length < 6) {
    res.status(400)
    throw new Error('Password must be at least 6 characters.')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    res.status(409)
    throw new Error('An account with this email already exists.')
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    preferences: preferences || undefined,
    authProvider: 'local',
  })

  const accessToken = await issueSession(res, user)
  res.status(201).json({ success: true, accessToken, user: user.toSafeJSON() })
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required.')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens')
  if (!user || !(await user.comparePassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password.')
  }

  const accessToken = await issueSession(res, user)
  res.json({ success: true, accessToken, user: user.toSafeJSON() })
})

// POST /api/auth/refresh — reads the httpOnly refresh cookie, rotates it, issues a new access token.
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME]
  if (!token) {
    res.status(401)
    throw new Error('No active session.')
  }

  let decoded
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    res.status(401)
    throw new Error('Session expired — please log in again.')
  }

  const user = await User.findById(decoded.id).select('+refreshTokens')
  if (!user) {
    res.status(401)
    throw new Error('Account no longer exists.')
  }

  const matches = await Promise.all((user.refreshTokens || []).map((h) => bcrypt.compare(token, h)))
  if (!matches.some(Boolean)) {
    res.status(401)
    throw new Error('Session expired — please log in again.')
  }

  // Rotate: drop the used refresh token, issue a fresh pair.
  const stillValid = []
  for (let i = 0; i < user.refreshTokens.length; i++) {
    if (!matches[i]) stillValid.push(user.refreshTokens[i])
  }
  user.refreshTokens = stillValid
  await user.save()

  const accessToken = await issueSession(res, user)
  res.json({ success: true, accessToken, user: user.toSafeJSON() })
})

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME]
  if (token) {
    try {
      const decoded = verifyRefreshToken(token)
      const user = await User.findById(decoded.id).select('+refreshTokens')
      if (user) {
        const matches = await Promise.all((user.refreshTokens || []).map((h) => bcrypt.compare(token, h)))
        user.refreshTokens = user.refreshTokens.filter((_, i) => !matches[i])
        await user.save()
      }
    } catch {
      // already expired/invalid — nothing to clean up
    }
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' })
  res.json({ success: true, message: 'Logged out.' })
})

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() })
})

// GET /api/auth/google/callback (after passport.authenticate('google') populates req.user)
const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user
  const accessToken = await issueSession(res, user)
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  res.redirect(`${clientUrl}/oauth/callback?accessToken=${encodeURIComponent(accessToken)}`)
})

module.exports = { register, login, refresh, logout, me, googleCallback }

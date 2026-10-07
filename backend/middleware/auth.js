const asyncHandler = require('express-async-handler')
const { verifyAccessToken } = require('../utils/tokens')
const User = require('../models/User')

/** Requires a valid JWT access token. Attaches req.user (safe fields only). */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    res.status(401)
    throw new Error('Not authenticated — please log in.')
  }

  try {
    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(401)
      throw new Error('Account no longer exists.')
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Session expired — please log in again.')
  }
})

/** Must be used after `protect`. Restricts a route to admin users only. */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Admin access required.')
  }
  next()
}

/** Attaches req.user if a valid token is present, but never rejects the request. */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) {
    try {
      const decoded = verifyAccessToken(token)
      req.user = await User.findById(decoded.id)
    } catch {
      // ignore invalid/expired token for optional auth
    }
  }
  next()
})

module.exports = { protect, adminOnly, optionalAuth }

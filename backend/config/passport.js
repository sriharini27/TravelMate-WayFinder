const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

// Google OAuth is optional — if credentials aren't configured, the server
// still runs fine with email/password auth; /api/auth/google just won't work.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase()
          const profileImage = profile.photos?.[0]?.value || ''

          let user = await User.findOne({ googleId: profile.id })
          if (!user && email) {
            // Link an existing email/password account to this Google identity.
            user = await User.findOne({ email })
          }

          if (!user) {
            user = await User.create({
              name: profile.displayName || 'TravelMate Traveller',
              email,
              googleId: profile.id,
              profileImage,
              role: 'user',
              authProvider: 'google',
            })
          } else {
            user.googleId = user.googleId || profile.id
            user.profileImage = user.profileImage || profileImage
            user.lastLoginAt = new Date()
            await user.save()
          }

          return done(null, user)
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )
}

module.exports = passport

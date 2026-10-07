const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false }, // absent for Google-only accounts
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    preferences: {
      styles: { type: [String], default: [] },
      budgetRange: { type: String, default: '' },
      language: { type: String, enum: ['en', 'ta', 'hi'], default: 'en' },
    },
    // Hashed refresh tokens currently valid for this user (one per active device/session).
    refreshTokens: { type: [String], default: [], select: false },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false)
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profileImage: this.profileImage,
    role: this.role,
    authProvider: this.authProvider,
    preferences: this.preferences,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  }
}

applyToJSON(userSchema)

module.exports = mongoose.model('User', userSchema)

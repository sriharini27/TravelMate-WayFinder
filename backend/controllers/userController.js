const asyncHandler = require('express-async-handler')
const User = require('../models/User')

// PUT /api/users/me  { name, profileImage, preferences: {styles, budgetRange, language} }
const updateProfile = asyncHandler(async (req, res) => {
  const { name, profileImage, preferences } = req.body
  const user = await User.findById(req.user._id)

  if (name) user.name = name
  if (profileImage !== undefined) user.profileImage = profileImage
  if (preferences) {
    user.preferences = {
      ...user.preferences.toObject?.() || user.preferences,
      ...preferences,
    }
  }

  await user.save()
  res.json({ success: true, user: user.toSafeJSON() })
})

module.exports = { updateProfile }

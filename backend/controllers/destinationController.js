const asyncHandler = require('express-async-handler')
const Destination = require('../models/Destination')
const crudFactory = require('./crudFactory')

const base = crudFactory(Destination, { searchFields: ['name', 'country', 'description'] })

// GET /api/destinations/by-name/:name — the frontend mostly looks destinations
// up by name (it's effectively the natural key used throughout the UI).
const getByName = asyncHandler(async (req, res) => {
  const item = await Destination.findOne({ name: req.params.name })
  if (!item) {
    res.status(404)
    throw new Error('Destination not found.')
  }
  res.json({ success: true, item })
})

module.exports = { ...base, getByName }

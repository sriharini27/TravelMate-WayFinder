const asyncHandler = require('express-async-handler')
const Attraction = require('../models/Attraction')
const crudFactory = require('./crudFactory')

const base = crudFactory(Attraction, { searchFields: ['name', 'destination'] })

// GET /api/attractions/by-destination/:name — the verified attraction pool the
// AI itinerary generator (generateTrip.js) selects from for a given
// destination. Only verified + active rows are ever returned, so the
// generator can never surface a fictional or unverified place.
const getByDestination = asyncHandler(async (req, res) => {
  const items = await Attraction.find({
    destination: req.params.name,
    verified: true,
    isActive: true,
  }).sort('name')
  res.json({ success: true, count: items.length, items })
})

module.exports = { ...base, getByDestination }

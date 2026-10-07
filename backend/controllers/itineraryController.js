const asyncHandler = require('express-async-handler')
const Itinerary = require('../models/Itinerary')
const crudFactory = require('./crudFactory')

const base = crudFactory(Itinerary)

// GET /api/itineraries/by-destination/:name — the "activity bank" the client-side
// AI planner (generateTrip.js) draws from for a given destination.
const getByDestination = asyncHandler(async (req, res) => {
  const item = await Itinerary.findOne({ destination: req.params.name })
  if (!item) {
    res.status(404)
    throw new Error('No itinerary bank found for this destination.')
  }
  res.json({ success: true, item })
})

module.exports = { ...base, getByDestination }

const asyncHandler = require('express-async-handler')

/**
 * Generic REST CRUD controller used for simple reference-data models
 * (Destination, Hotel, Room, Package, Offer). Keeps repetitive list/get/
 * create/update/delete logic in one place instead of duplicating it five
 * times — admin-only mutation routes wrap these with `protect` + `adminOnly`.
 */
function crudFactory(Model, { searchFields = [] } = {}) {
  const list = asyncHandler(async (req, res) => {
    const filter = {}
    Object.keys(req.query).forEach((key) => {
      if (['search', 'limit', 'page', 'sort'].includes(key)) return
      filter[key] = req.query[key]
    })
    if (req.query.search && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: new RegExp(req.query.search, 'i') }))
    }

    const limit = Math.min(Number(req.query.limit) || 100, 200)
    const page = Math.max(Number(req.query.page) || 1, 1)

    const [items, total] = await Promise.all([
      Model.find(filter)
        .sort(req.query.sort || '-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
      Model.countDocuments(filter),
    ])

    res.json({ success: true, count: items.length, total, page, items })
  })

  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id)
    if (!item) {
      res.status(404)
      throw new Error(`${Model.modelName} not found.`)
    }
    res.json({ success: true, item })
  })

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body)
    res.status(201).json({ success: true, item })
  })

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!item) {
      res.status(404)
      throw new Error(`${Model.modelName} not found.`)
    }
    res.json({ success: true, item })
  })

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id)
    if (!item) {
      res.status(404)
      throw new Error(`${Model.modelName} not found.`)
    }
    res.json({ success: true, message: `${Model.modelName} deleted.` })
  })

  return { list, getOne, create, update, remove }
}

module.exports = crudFactory

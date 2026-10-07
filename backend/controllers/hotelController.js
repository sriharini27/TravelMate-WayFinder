const Hotel = require('../models/Hotel')
const crudFactory = require('./crudFactory')

module.exports = crudFactory(Hotel, { searchFields: ['name', 'destination'] })

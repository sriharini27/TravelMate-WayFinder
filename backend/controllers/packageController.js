const Package = require('../models/Package')
const crudFactory = require('./crudFactory')

module.exports = crudFactory(Package, { searchFields: ['name', 'destination', 'description'] })

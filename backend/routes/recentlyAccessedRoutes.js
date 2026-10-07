const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/recentlyAccessedController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.get('/', ctrl.getRecentlyAccessed)
router.post('/', ctrl.recordAccess)

module.exports = router

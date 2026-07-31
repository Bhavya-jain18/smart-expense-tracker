const express = require('express')
const { getAnalytics } = require('../controllers/analyticsController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)
router.get('/', getAnalytics)

module.exports = router

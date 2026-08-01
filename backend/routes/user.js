const express = require('express')
const {
  loginUser,
  signupUser,
  getCurrentUser,
  updateCurrentUser
} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' })
})

// current user profile
router.get('/me', requireAuth, getCurrentUser)
router.patch('/me', requireAuth, updateCurrentUser)
router.patch('/update-password', requireAuth, updateCurrentUser)

module.exports = router

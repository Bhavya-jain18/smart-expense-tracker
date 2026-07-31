const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)

    res.status(200).json({ email: user.email, token, budget: user.budget, _id: user._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.signup(email, password)
    const token = createToken(user._id)

    res.status(201).json({ email: user.email, token, budget: user.budget, _id: user._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' })
  }

  res.status(200).json({ email: req.user.email, budget: req.user.budget, _id: req.user._id })
}

const updateCurrentUser = async (req, res) => {
  const { budget, currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (budget !== undefined) {
    if (Number(budget) < 0) {
      return res.status(400).json({ error: 'Budget must be zero or greater' })
    }
    user.budget = Number(budget)
  }

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to change password' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
  }

  await user.save()
  res.status(200).json({ email: user.email, budget: user.budget, _id: user._id })
}

module.exports = { loginUser, signupUser, getCurrentUser, updateCurrentUser }

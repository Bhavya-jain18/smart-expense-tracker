const express = require('express')
const {
  getExpenses,
  getExpense,
  createExpense,
  deleteExpense,
  updateExpense
} = require('../controllers/expenseController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getExpenses)
router.get('/:id', getExpense)
router.post('/', createExpense)
router.patch('/:id', updateExpense)
router.delete('/:id', deleteExpense)

module.exports = router

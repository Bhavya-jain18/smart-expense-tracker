const mongoose = require('mongoose')
const Expense = require('../models/expenseModel')

const allowedSorts = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  highest: { amount: -1 },
  lowest: { amount: 1 }
}

const parseQuery = (value) => {
  if (!value) return null
  return value.trim()
}

const buildFilters = (query, user_id) => {
  const filters = { createdBy: user_id }

  if (query.search) {
    const regex = new RegExp(parseQuery(query.search), 'i')
    filters.$or = [{ title: regex }, { notes: regex }]
  }

  if (query.category) {
    filters.category = parseQuery(query.category)
  }

  if (query.paymentMethod) {
    filters.paymentMethod = parseQuery(query.paymentMethod)
  }

  if (query.startDate || query.endDate) {
    filters.date = {}
    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate)
    }
    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate)
    }
  }

  if (query.minAmount || query.maxAmount) {
    filters.amount = {}
    if (query.minAmount) {
      filters.amount.$gte = Number(query.minAmount)
    }
    if (query.maxAmount) {
      filters.amount.$lte = Number(query.maxAmount)
    }
  }

  return filters
}

const getExpenses = async (req, res) => {
  const user_id = req.user._id
  const {
    page = 1,
    limit = 12,
    sort = 'newest'
  } = req.query

  const filters = buildFilters(req.query, user_id)
  const pageNumber = Math.max(Number(page), 1)
  const pageSize = Math.max(Number(limit), 1)

  const expenses = await Expense.find(filters)
    .sort(allowedSorts[sort] || allowedSorts.newest)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)

  const total = await Expense.countDocuments(filters)

  res.status(200).json({
    expenses,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  })
}

const getExpense = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such expense' })
  }

  const expense = await Expense.findOne({ _id: id, createdBy: req.user._id })

  if (!expense) {
    return res.status(404).json({ error: 'No such expense' })
  }

  res.status(200).json(expense)
}

const createExpense = async (req, res) => {
  const { title, amount, category, paymentMethod, date, notes } = req.body

  const emptyFields = []
  if (!title) emptyFields.push('title')
  if (amount === undefined || amount === null || amount === '') emptyFields.push('amount')
  if (!category) emptyFields.push('category')
  if (!paymentMethod) emptyFields.push('paymentMethod')
  if (!date) emptyFields.push('date')

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: 'Please fill out all required fields',
      emptyFields
    })
  }

  if (Number(amount) < 0) {
    return res.status(400).json({ error: 'Expense amount must be positive' })
  }

  try {
    const createdBy = req.user._id
    const expense = await Expense.create({
      title: title.trim(),
      amount: Number(amount),
      category,
      paymentMethod,
      date: new Date(date),
      notes: notes ? notes.trim() : '',
      createdBy
    })

    res.status(201).json(expense)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteExpense = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such expense' })
  }

  const expense = await Expense.findOneAndDelete({ _id: id, createdBy: req.user._id })

  if (!expense) {
    return res.status(404).json({ error: 'No such expense' })
  }

  res.status(200).json(expense)
}

const updateExpense = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such expense' })
  }

  const updates = {}
  const fields = ['title', 'amount', 'category', 'paymentMethod', 'date', 'notes']
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = field === 'amount' ? Number(req.body[field]) : req.body[field]
    }
  })

  if (updates.amount !== undefined && updates.amount < 0) {
    return res.status(400).json({ error: 'Expense amount must be positive' })
  }

  if (updates.title) updates.title = updates.title.trim()
  if (updates.notes !== undefined) updates.notes = `${updates.notes}`.trim()
  if (updates.date) updates.date = new Date(updates.date)

  const expense = await Expense.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    updates,
    { new: true }
  )

  if (!expense) {
    return res.status(404).json({ error: 'No such expense' })
  }

  res.status(200).json(expense)
}

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  deleteExpense,
  updateExpense
}

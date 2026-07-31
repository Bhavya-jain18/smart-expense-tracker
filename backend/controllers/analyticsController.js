const Expense = require('../models/expenseModel')

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
const startOfLastMonth = (date) => {
  const year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()
  const month = date.getMonth() === 0 ? 11 : date.getMonth() - 1
  return new Date(year, month, 1)
}

const formatCurrency = (value) => Number(value.toFixed(2))

const buildCategoryTotals = (expenses) => {
  return expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount
    return totals
  }, {})
}

const getTopCategory = (categoryTotals) => {
  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  return sorted.length ? sorted[0][0] : null
}

const getPeriodTotal = (expenses, from, to) =>
  expenses
    .filter((expense) => expense.date >= from && expense.date < to)
    .reduce((sum, expense) => sum + expense.amount, 0)

const getDailyTotals = (expenses, start, days) => {
  const totals = []

  for (let index = 0; index < days; index += 1) {
    const currentDay = new Date(start)
    currentDay.setDate(currentDay.getDate() + index)
    const nextDay = new Date(currentDay)
    nextDay.setDate(currentDay.getDate() + 1)

    const total = getPeriodTotal(expenses, currentDay, nextDay)
    totals.push({ label: currentDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), value: formatCurrency(total) })
  }

  return totals
}

const buildInsights = ({
  currentMonthTotal,
  lastMonthTotal,
  categoryTotals,
  monthlyCategoryTotals,
  budget,
  expenses,
  now
}) => {
  const insights = []
  const totalExpenses = expenses.length

  if (budget > 0) {
    const usedPercent = Math.min(100, Math.round((currentMonthTotal / budget) * 100))
    insights.push(`You have already used ${usedPercent}% of your monthly budget.`)
  }

  const topCategory = getTopCategory(monthlyCategoryTotals)
  if (topCategory) {
    const topAmount = monthlyCategoryTotals[topCategory]
    const topPercent = Math.round((topAmount / currentMonthTotal) * 100)
    insights.push(`You spent ${topPercent}% of this month's expenses on ${topCategory}.`)
  }

  if (lastMonthTotal >= 0 && currentMonthTotal > 0) {
    const change = currentMonthTotal - lastMonthTotal
    const changeRatio = lastMonthTotal ? change / lastMonthTotal : 1
    if (Math.abs(changeRatio) >= 0.25) {
      const direction = change > 0 ? 'increased' : 'dropped'
      const percent = Math.round(Math.abs(changeRatio) * 100)
      insights.push(`Your total spending ${direction} by ${percent}% compared to last month.`)
    }
  }

  const weekendTotal = expenses
    .filter((expense) => {
      const weekday = expense.date.getDay()
      return weekday === 0 || weekday === 6
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const weekdayTotal = expenses
    .filter((expense) => {
      const weekday = expense.date.getDay()
      return weekday >= 1 && weekday <= 5
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  if (weekendTotal > 0 && weekendTotal > weekdayTotal) {
    insights.push('You spend the most on weekends, keep an eye on weekend outings.')
  }

  const latestExpense = expenses.reduce((latest, expense) => {
    return !latest || expense.date > latest.date ? expense : latest
  }, null)

  if (latestExpense) {
    const diff = Math.floor((now - latestExpense.date) / (1000 * 60 * 60 * 24))
    if (diff >= 5) {
      insights.push(`You haven't added expenses in ${diff} days.`)
    }
  }

  if (monthlyCategoryTotals.Shopping && monthlyCategoryTotals.Shopping > 0) {
    const savings = Math.round((monthlyCategoryTotals.Shopping || 0) * 0.2)
    insights.push(`You can save around £${savings} this month by reducing shopping spending by 20%.`)
  }

  if (insights.length < 4 && topCategory) {
    insights.push(`Your biggest spending category this month is ${topCategory}.`)
  }

  return insights.slice(0, 6)
}

const getAnalytics = async (req, res) => {
  const user_id = req.user._id
  const now = new Date()
  const today = startOfDay(now)
  const monthStart = startOfMonth(now)
  const lastMonthStart = startOfLastMonth(now)
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const expenses = await Expense.find({ createdBy: user_id }).sort({ date: 1 })

  const totalExpense = formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))
  const monthlyExpense = formatCurrency(getPeriodTotal(expenses, monthStart, nextMonthStart))
  const weeklyExpense = formatCurrency(getPeriodTotal(expenses, new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)))

  const categoryTotals = buildCategoryTotals(expenses)
  const monthlyCategoryTotals = buildCategoryTotals(expenses.filter((expense) => expense.date >= monthStart && expense.date < nextMonthStart))
  const topCategory = getTopCategory(monthlyCategoryTotals)
  const budget = req.user.budget || 0
  const budgetUsed = monthlyExpense
  const budgetRemaining = formatCurrency(Math.max(0, budget - monthlyExpense))
  const averageDailyExpense = monthStart <= now ? formatCurrency(monthlyExpense / Math.max(1, now.getDate())) : 0
  const lastWeekStart = new Date(today)
  lastWeekStart.setDate(today.getDate() - 6)
  const weeklyLabels = getDailyTotals(expenses, lastWeekStart, 7)
  const insights = buildInsights({ currentMonthTotal: monthlyExpense, lastMonthTotal: getPeriodTotal(expenses, lastMonthStart, monthStart), categoryTotals, monthlyCategoryTotals, budget, expenses, now })

  res.status(200).json({
    totalExpense,
    monthlyExpense,
    weeklyExpense,
    categoryTotals: monthlyCategoryTotals,
    topCategory,
    budgetUsed,
    budgetRemaining,
    budget,
    averageDailyExpense,
    transactionsCount: expenses.length,
    insights,
    weeklySpending: weeklyLabels
  })
}

module.exports = { getAnalytics }

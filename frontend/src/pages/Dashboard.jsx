import { useEffect, useState } from 'react'
import { useExpensesContext } from '../hooks/useExpensesContext'
import api from '../services/api'
import SummaryCard from '../components/SummaryCard'
import InsightCard from '../components/InsightCard'
import BudgetProgress from '../components/BudgetProgress'
import { Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

const Dashboard = () => {
  const { analytics, dispatch } = useExpensesContext()
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics')
      setError(null)
      return response.data
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load analytics')
      return null
    }
  }

  const fetchRecentExpenses = async () => {
    try {
      const response = await api.get('/expenses', { params: { page: 1, limit: 6, sort: 'newest' } })
      setRecent(response.data.expenses)
    } catch (err) {
      console.warn('Unable to fetch recent expenses', err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await fetchAnalytics()
      if (data) {
        dispatch({ type: 'SET_ANALYTICS', payload: data })
      }
      await fetchRecentExpenses()
      setLoading(false)
    }

    loadData()
  }, [dispatch])

  const analyticsData = analytics || {}
  const pieData = {
    labels: Object.keys(analyticsData.categoryTotals || {}),
    datasets: [
      {
        data: Object.values(analyticsData.categoryTotals || {}),
        backgroundColor: ['#a65c5c', '#b78274', '#6f7d8c', '#8d6b6b', '#8d5b5b', '#53616f'],
        borderWidth: 0
      }
    ]
  }

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Monthly spending',
        data: [1200, 980, 1420, analyticsData.monthlyExpense || 0],
        borderColor: '#a65c5c',
        backgroundColor: 'rgba(166,92,92,0.15)',
        tension: 0.4
      }
    ]
  }

  return (
    <div className="page-shell">
      <div className="dashboard-grid">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2>Overview</h2>
          </div>
          <p>{analyticsData.insights?.length ? analyticsData.insights[0] : 'Welcome to your expense insights.'}</p>
        </div>

        <div className="summary-grid">
          <SummaryCard title="Total spent" value={`£${analyticsData.totalExpense || '0.00'}`} />
          <SummaryCard title="Weekly" value={`£${analyticsData.weeklyExpense || '0.00'}`} />
          <SummaryCard title="Monthly" value={`£${analyticsData.monthlyExpense || '0.00'}`} />
          <SummaryCard title="Top category" value={analyticsData.topCategory || 'None'} />
          <SummaryCard title="Average/day" value={`£${analyticsData.averageDailyExpense || '0.00'}`} />
          <SummaryCard title="Transactions" value={analyticsData.transactionsCount || 0} />
        </div>

        <div className="analytics-grid">
          <div className="chart-card">
            <h3>Category distribution</h3>
            <Pie data={pieData} />
          </div>
          <div className="chart-card">
            <h3>Monthly overview</h3>
            <Line data={lineData} />
          </div>
          <BudgetProgress
            budget={analyticsData.budgetUsed ? Number(analyticsData.budgetUsed) + Number(analyticsData.budgetRemaining) : 0}
            budgetUsed={Number(analyticsData.budgetUsed || 0)}
            budgetRemaining={Number(analyticsData.budgetRemaining || 0)}
          />
          <InsightCard insights={analyticsData.insights || ['Add expenses to begin generating insights.']} />
        </div>

        <div className="recent-card">
          <h3>Recent transactions</h3>
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="empty-state">No recent expenses yet.</div>
          ) : (
            <div className="recent-list">
              {recent.map((expense) => (
                <article key={expense._id} className="recent-item">
                  <div>
                    <p className="expense-title">{expense.title}</p>
                    <span>{expense.category}</span>
                  </div>
                  <div>
                    <strong>£{expense.amount.toFixed(2)}</strong>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

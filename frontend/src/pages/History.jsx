import { useEffect, useState } from 'react'
import api from '../services/api'
import ExpenseTable from '../components/ExpenseTable'
import { useExpensesContext } from '../hooks/useExpensesContext'
import { toast } from 'react-hot-toast'

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Rent', 'Entertainment', 'Education', 'Medical', 'Investment', 'Others']
const paymentMethods = ['Cash', 'Card', 'UPI', 'Online', 'Other']
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest Amount' },
  { value: 'lowest', label: 'Lowest Amount' }
]

const History = () => {
  const { dispatch } = useExpensesContext()
  const [expenses, setExpenses] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await api.get('/expenses', {
        params: {
          search,
          category,
          paymentMethod,
          startDate,
          endDate,
          sort,
          page,
          limit: 10
        }
      })

      setExpenses(response.data.expenses)
      setTotalPages(response.data.meta.totalPages)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [search, category, paymentMethod, startDate, endDate, sort, page])

  const [editingExpense, setEditingExpense] = useState(null)
  const [editData, setEditData] = useState({
    title: '',
    amount: '',
    category: '',
    paymentMethod: '',
    date: '',
    notes: ''
  })

  const handleDelete = async (expense) => {
    if (!confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${expense._id}`)
      toast.success('Expense deleted')
      fetchExpenses()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to delete expense')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setEditData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      date: expense.date.slice(0, 10),
      notes: expense.notes || ''
    })
  }

  const handleEditSave = async () => {
    if (!editingExpense) return
    try {
      await api.patch(`/expenses/${editingExpense._id}`, {
        ...editData,
        amount: Number(editData.amount)
      })
      toast.success('Expense updated')
      setEditingExpense(null)
      fetchExpenses()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to update expense')
    }
  }

  const handleEditCancel = () => {
    setEditingExpense(null)
  }

  const handleReset = () => {
    setSearch('')
    setCategory('')
    setPaymentMethod('')
    setStartDate('')
    setEndDate('')
    setSort('newest')
    setPage(1)
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Expense History</p>
          <h2>Review your spending</h2>
        </div>
      </div>

      <div className="filter-panel">
        <div className="filter-row">
          <label>
            Search
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or notes" />
          </label>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Payment
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">All</option>
              {paymentMethods.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-row">
          <label>
            From
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            To
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label>
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="page-card">
        {loading ? (
          <div className="empty-state">Loading expenses...</div>
        ) : (
          <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <div className="pagination-row">
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Next
        </button>
      </div>

      {editingExpense && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Edit expense</h3>
            <div className="form-row">
              <label>Title</label>
              <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Amount</label>
              <input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Category</label>
              <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })}>
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Payment</label>
              <select value={editData.paymentMethod} onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })}>
                {paymentMethods.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Date</label>
              <input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Notes</label>
              <textarea value={editData.notes} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} rows="3" />
            </div>
            <div className="modal-actions">
              <button type="button" className="primary-button" onClick={handleEditSave}>Save changes</button>
              <button type="button" className="secondary-button" onClick={handleEditCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History

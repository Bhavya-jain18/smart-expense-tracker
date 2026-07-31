import { useState } from 'react'
import { useExpensesContext } from '../hooks/useExpensesContext'
import api from '../services/api'

const categories = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Rent',
  'Entertainment',
  'Education',
  'Medical',
  'Investment',
  'Others'
]

const paymentOptions = ['Cash', 'Card', 'UPI', 'Online', 'Other']

const ExpenseForm = ({ onSuccess }) => {
  const { dispatch } = useExpensesContext()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await api.post('/expenses', {
        title,
        amount: Number(amount),
        category,
        paymentMethod,
        date,
        notes
      })
      dispatch({ type: 'ADD_EXPENSE', payload: response.data })
      setTitle('')
      setAmount('')
      setCategory('Food')
      setPaymentMethod('Cash')
      setDate(new Date().toISOString().slice(0, 10))
      setNotes('')
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create expense')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0" step="0.01" />
      </div>
      <div className="form-row">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          {paymentOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" />
      </div>
      <button type="submit" disabled={isLoading} className="primary-button">
        {isLoading ? 'Saving...' : 'Add Expense'}
      </button>
      {error && <div className="form-error">{error}</div>}
    </form>
  )
}

export default ExpenseForm

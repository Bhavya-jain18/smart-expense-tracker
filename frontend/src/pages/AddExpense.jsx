import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ExpenseForm from '../components/ExpenseForm'

const AddExpense = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    toast.success('Expense added successfully')
    navigate('/dashboard')
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Add Expense</p>
          <h2>New expense details</h2>
        </div>
      </div>
      <div className="page-card">
        <ExpenseForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default AddExpense

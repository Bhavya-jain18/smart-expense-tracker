import ExpenseRow from './ExpenseRow'

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return <div className="empty-state">No expenses found yet.</div>
  }

  return (
    <div className="table-card">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Payment</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <ExpenseRow key={expense._id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseTable

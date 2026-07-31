const ExpenseRow = ({ expense, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{new Date(expense.date).toLocaleDateString()}</td>
      <td>{expense.title}</td>
      <td>£{expense.amount.toFixed(2)}</td>
      <td>{expense.category}</td>
      <td>{expense.paymentMethod}</td>
      <td>{expense.notes || '-'}</td>
      <td>
        <button className="icon-button" onClick={() => onEdit(expense)}>
          Edit
        </button>
        <button className="icon-button danger" onClick={() => onDelete(expense)}>
          Delete
        </button>
      </td>
    </tr>
  )
}

export default ExpenseRow

const BudgetProgress = ({ budgetUsed, budgetRemaining, budget }) => {
  const used = Number(budget || 0) === 0 ? 0 : Math.min(100, Math.round((budgetUsed / budget) * 100))
  const status = used >= 100 ? 'critical' : used >= 90 ? 'warning' : used >= 70 ? 'alert' : 'healthy'

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div>
          <p className="summary-label">Monthly Budget</p>
          <h3>£{budget.toFixed(2)}</h3>
        </div>
        <span className={`budget-tag ${status}`}>{status === 'critical' ? 'Over budget' : status === 'warning' ? 'Almost full' : status === 'alert' ? 'Rising' : 'Healthy'}</span>
      </div>
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${used}%` }} />
        </div>
        <div className="progress-details">
          <span>Used: {used}%</span>
          <span>Remaining: £{budgetRemaining.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default BudgetProgress

import { motion } from 'framer-motion'

const BudgetProgress = ({ budgetUsed, budgetRemaining, budget }) => {
  const used = Number(budget || 0) === 0 ? 0 : Math.min(100, Math.round((budgetUsed / budget) * 100))
  const status = used >= 100 ? 'critical' : used >= 90 ? 'warning' : used >= 70 ? 'alert' : 'healthy'

  return (
    <motion.div className="budget-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="budget-header">
        <div>
          <p className="summary-label">Monthly Budget</p>
          <h3>£{budget.toFixed(2)}</h3>
        </div>
        <span className={`budget-tag ${status}`}>{status === 'critical' ? 'Over budget' : status === 'warning' ? 'Almost full' : status === 'alert' ? 'Rising' : 'Healthy'}</span>
      </div>
      <div className="progress-wrapper">
        <div className="progress-bar">
          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${used}%` }} transition={{ duration: 0.6 }} />
        </div>
        <div className="progress-details">
          <span>Used: {used}%</span>
          <span>Remaining: £{budgetRemaining.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default BudgetProgress

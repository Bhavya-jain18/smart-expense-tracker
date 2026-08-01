import { motion } from 'framer-motion'

const InsightCard = ({ insights }) => {
  return (
    <motion.div className="insight-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h3>AI Insights</h3>
      <ul>
        {insights.map((insight, index) => (
          <motion.li key={index} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: index * 0.06 }}>
            {insight}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default InsightCard

import { motion } from 'framer-motion'

const SummaryCard = ({ title, value, subtitle, accent }) => {
  return (
    <motion.div
      className={`summary-card ${accent || ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div>
        <p className="summary-label">{title}</p>
        <h3>{value}</h3>
      </div>
      {subtitle && <p className="summary-note">{subtitle}</p>}
    </motion.div>
  )
}

export default SummaryCard

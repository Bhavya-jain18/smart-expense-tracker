const SummaryCard = ({ title, value, subtitle, accent }) => {
  return (
    <div className={`summary-card ${accent || ''}`}>
      <div>
        <p className="summary-label">{title}</p>
        <h3>{value}</h3>
      </div>
      {subtitle && <p className="summary-note">{subtitle}</p>}
    </div>
  )
}

export default SummaryCard

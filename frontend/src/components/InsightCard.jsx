const InsightCard = ({ insights }) => {
  return (
    <div className="insight-card">
      <h3>AI Insights</h3>
      <ul>
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  )
}

export default InsightCard

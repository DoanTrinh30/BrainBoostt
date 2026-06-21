export default function KpiCard({ icon, label, value, trend, trendType = 'up' }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className={`kpi-trend ${trendType === 'up' ? 'positive' : 'negative'}`}>
          {trend}
        </span>
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  )
}
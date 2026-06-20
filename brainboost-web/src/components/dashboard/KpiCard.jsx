import './DashboardCards.css'

export default function KpiCard({ icon, label, value, trend, trendType }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className={`kpi-trend ${trendType}`}>
          {trendType === 'up' ? '📈' : '📉'} {trend}
        </span>
      </div>
      <p className="kpi-label">{label}</p>
      <h3 className="kpi-value">{value}</h3>
    </div>
  )
}

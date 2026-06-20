import './ChartCard.css'

export default function ChartCard({ 
  title, 
  subtitle, 
  children,
  action 
}) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle">{subtitle}</p>
        </div>
        {action && <button className="chart-action">{action}</button>}
      </div>
      <div className="chart-content">
        {children}
      </div>
    </div>
  )
}

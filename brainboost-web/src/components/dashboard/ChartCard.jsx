export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      {children}
    </div>
  )
}
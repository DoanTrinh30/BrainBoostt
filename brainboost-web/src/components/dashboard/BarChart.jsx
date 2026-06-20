import './BarChart.css'

export default function BarChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bar-chart">
      {data.map((item) => (
        <div key={item.label} className="bar-wrapper">
          <div className="bar-container">
            <div 
              className={`bar ${item.type || 'primary'}`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <label className="bar-label">{item.label}</label>
        </div>
      ))}
    </div>
  )
}

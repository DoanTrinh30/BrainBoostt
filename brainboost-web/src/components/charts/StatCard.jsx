import Card from '../ui/Card'
 
export default function StatCard({ 
  icon, 
  title, 
  value, 
  change,
  changeType = 'positive',
  color = 'blue'
}) {
  const colorBg = {
    blue: 'bg-blue-50',
    green: 'bg-emerald-50',
    orange: 'bg-orange-50',
    pink: 'bg-pink-50',
  }
  
  return (
    <Card variant="light">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-3">{value}</h3>
          {change && (
            <p className={`text-xs mt-2 font-semibold ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={`text-4xl p-3 rounded-xl ${colorBg[color]}`}>{icon}</div>
      </div>
    </Card>
  )
}

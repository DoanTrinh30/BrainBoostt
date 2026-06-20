import Card from '../../components/ui/Card'
import StatCard from '../../components/charts/StatCard'
 
export default function MLMonitoringPage() {
  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">🧠 ML Monitoring</h1>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📊" title="Accuracy" value="85.2%" change="+1.2%" color="blue" />
        <StatCard icon="⚡" title="Predictions" value="12.4k" change="+15%" color="green" />
        <StatCard icon="⏱️" title="Latency" value="145ms" change="-20ms" color="orange" />
      </div>
 
      <Card variant="elevated">
        <h2 className="text-xl font-bold mb-6 text-gray-900">📈 Performance</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-900">Precision</span>
              <span className="font-bold text-emerald-600">87.3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{width: '87.3%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-900">Recall</span>
              <span className="font-bold text-blue-600">83.1%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '83.1%'}}></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

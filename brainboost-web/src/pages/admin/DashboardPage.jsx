import AdminLayout from '../../components/layout/AdminLayout'
import './AdminDashboard.css'

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="headline-lg">System Overview</h1>
        <p className="text-secondary">Real-time system metrics and statistics</p>

        {/* KPI Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">25,432</h3>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏫</span>
            <p className="stat-label">Total Classes</p>
            <h3 className="stat-value">458</h3>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <p className="stat-label">Total Decks</p>
            <h3 className="stat-value">1,234</h3>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <p className="stat-label">Average Accuracy</p>
            <h3 className="stat-value">82.5%</h3>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
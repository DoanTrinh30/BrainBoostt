import { useEffect, useState } from 'react'
import { analyticsService } from '../../services/analyticsService'
import './DashboardPage.css'

// KPI Card Component
function KpiCard({ icon, label, value, trend, trendType = 'up' }) {
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

// Chart Card Component
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      {children}
    </div>
  )
}

// Bar Chart Component
function BarChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="chart-placeholder">📊 Chưa có dữ liệu</div>
  }

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bar-chart">
      {data.map((item, idx) => (
        <div key={idx} className="bar-item">
          <div
            className="bar"
            style={{ height: `${(item.value / maxValue) * 200}px` }}
            title={`${item.label}: ${item.value}`}
          ></div>
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// Main Dashboard Component
export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, activityData] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getWeeklyActivity()
      ])

      console.log('✅ Stats data:', statsData)
      console.log('✅ Activity data:', activityData)

      setStats(statsData || {})

      if (Array.isArray(activityData)) {
        setWeeklyActivity(activityData)
      } else if (activityData?.data && Array.isArray(activityData.data)) {
        setWeeklyActivity(activityData.data)
      } else {
        setWeeklyActivity([])
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err)
      setError('Không thể tải dữ liệu dashboard')
      setStats({})
      setWeeklyActivity([])
    } finally {
      setLoading(false)
    }
  }

  // Transform weekly activity data
  const chartData = Array.isArray(weeklyActivity)
    ? weeklyActivity.map((item, idx) => ({
        label: item.label || item.day || `Ngày ${idx + 1}`,
        value: item.count || item.value || 0,
        type: 'primary'
      }))
    : [
        { label: 'T2', value: 45, type: 'primary' },
        { label: 'T3', value: 38, type: 'primary' },
        { label: 'T4', value: 62, type: 'primary' },
        { label: 'T5', value: 56, type: 'primary' },
        { label: 'T6', value: 48, type: 'primary' },
        { label: 'T7', value: 28, type: 'secondary' },
        { label: 'Chủ Nhật', value: 35, type: 'secondary' }
      ]

  if (loading) {
    return (
      <div className="dashboard-container">
        <p className="loading-text">⏳ Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-text">❌ {error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Tổng Quan Hệ Thống</h1>
          <p className="page-subtitle">
            Chào mừng trở lại. Đây là tình hình học tập và hoạt động của các lớp hôm nay.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          icon="📚"
          label="Tổng Số Lớp"
          value={stats?.totalClasses || stats?.classes_count || '0'}
          trend="+0 lớp mới"
          trendType="up"
        />
        <KpiCard
          icon="👥"
          label="Tổng Số Học Sinh"
          value={stats?.totalStudents || stats?.students_count || '0'}
          trend="+0%"
          trendType="up"
        />
        <KpiCard
          icon="📝"
          label="Lượt Ôn Tập"
          value={stats?.totalReviews || stats?.reviews_count || '0'}
          trend="+0 hôm nay"
          trendType="up"
        />
        <KpiCard
          icon="🧠"
          label="Độ Chính Xác AI"
          value={`${stats?.aiAccuracy || stats?.accuracy || '0'}%`}
          trend="Tối ưu"
          trendType="up"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <ChartCard
          title="Mức Độ Tương Tác Của Học Sinh"
          subtitle="Tăng trưởng hoạt động học tập theo tuần"
        >
          <div className="chart-placeholder">
            📈 Biểu đồ tương tác học sinh
          </div>
        </ChartCard>

        <ChartCard
          title="Hoạt Động Ôn Tập Trong Tuần"
          subtitle="Số phiên học flashcard trung bình của mỗi học sinh"
        >
          {chartData && chartData.length > 0 ? (
            <BarChart data={chartData} />
          ) : (
            <div className="chart-placeholder">📊 Đang tải dữ liệu...</div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
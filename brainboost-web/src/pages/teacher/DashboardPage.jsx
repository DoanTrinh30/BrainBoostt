import MainLayout from '../../components/layout/MainLayout'
import KpiCard from '../../components/dashboard/KpiCard'
import ChartCard from '../../components/dashboard/ChartCard'
import BarChart from '../../components/dashboard/BarChart'
import RecentActivity from '../../components/dashboard/RecentActivity'
import StudentsTable from '../../components/dashboard/StudentsTable'
import './DashboardPage.css'

const chartData = [
  { label: 'T2', value: 45, type: 'primary' },
  { label: 'T3', value: 38, type: 'primary' },
  { label: 'T4', value: 62, type: 'primary' },
  { label: 'T5', value: 56, type: 'primary' },
  { label: 'T6', value: 48, type: 'primary' },
  { label: 'T7', value: 28, type: 'secondary' },
  { label: 'Chủ Nhật', value: 35, type: 'secondary' },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="headline-lg">Tổng Quan Hệ Thống</h1>
            <p className="body-md" style={{ color: '#64748b', marginTop: '8px' }}>
              Chào mừng trở lại. Đây là tình hình học tập và hoạt động của các lớp hôm nay.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4">
          <KpiCard
            icon="📚"
            label="Tổng Số Lớp"
            value="12"
            trend="+2 lớp mới"
            trendType="up"
          />
          <KpiCard
            icon="👥"
            label="Tổng Số Học Sinh"
            value="450"
            trend="+12%"
            trendType="up"
          />
          <KpiCard
            icon="📝"
            label="Lượt Ôn Tập"
            value="1.2k"
            trend="+340 hôm nay"
            trendType="up"
          />
          <KpiCard
            icon="🧠"
            label="Độ Chính Xác AI"
            value="98.5%"
            trend="Tối ưu"
            trendType="up"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2">
          <ChartCard
            title="Mức Độ Tương Tác Của Học Sinh"
            subtitle="Tăng trưởng hoạt động học tập theo tuần"
          >
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              📈 Biểu đồ tương tác học sinh
            </div>
          </ChartCard>

          <ChartCard
            title="Hoạt Động Ôn Tập Trong Tuần"
            subtitle="Số phiên học flashcard trung bình của mỗi học sinh"
          >
            <BarChart data={chartData} />
          </ChartCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2">
          <RecentActivity />
          <StudentsTable />
        </div>
      </div>
    </MainLayout>
  )
}
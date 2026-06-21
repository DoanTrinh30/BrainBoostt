import React, { useState, useEffect } from 'react'
import { analyticsService } from '../../services/analyticsService'
import './AnalyticsPage.css'

function PerformanceRow({ className, excellent, good, average, poor }) {
  return (
    <tr className="performance-row">
      <td className="col-class">{className}</td>
      <td><span className="badge excellent">{excellent}%</span></td>
      <td><span className="badge good">{good}%</span></td>
      <td><span className="badge average">{average}%</span></td>
      <td><span className="badge poor">{poor}%</span></td>
    </tr>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState(null)
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, insightsData] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getInsights()
      ])

      setStats(statsData)
      setInsights(insightsData)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Không thể tải dữ liệu phân tích')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="analytics-page"><p>⏳ Đang tải...</p></div>
  if (error) return <div className="analytics-page"><p style={{color: 'red'}}>❌ {error}</p></div>

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Phân Tích</h1>
          <p className="page-subtitle">Phân tích chi tiết hiệu suất học tập</p>
        </div>

        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="period-select"
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm này</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">📚 Tổng Bài Học</p>
          <h3 className="kpi-value">{stats?.totalLessons || '0'}</h3>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">🎯 Độ Chính Xác TB</p>
          <h3 className="kpi-value">{stats?.averageAccuracy || '0'}%</h3>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">⏱️ Thời Gian TB</p>
          <h3 className="kpi-value">{stats?.averageTime || '0'} phút</h3>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">📈 Tiến Độ TB</p>
          <h3 className="kpi-value">{stats?.averageProgress || '0'}%</h3>
        </div>
      </div>

      {/* Performance Table */}
      <div className="card">
        <h3 className="section-title">📊 Hiệu Suất Theo Lớp</h3>

        <div className="table-container">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Lớp</th>
                <th>Xuất Sắc (90-100%)</th>
                <th>Tốt (80-90%)</th>
                <th>Trung Bình (70-80%)</th>
                <th>Cần Cải Thiện (0-70%)</th>
              </tr>
            </thead>

            <tbody>
              {insights?.classPerformance?.map((perf, idx) => (
                <PerformanceRow 
                  key={idx}
                  className={perf.className}
                  excellent={perf.excellent}
                  good={perf.good}
                  average={perf.average}
                  poor={perf.poor}
                />
              )) || (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center'}}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      {insights?.recommendation && (
        <div className="card" style={{marginTop: '20px'}}>
          <h3 className="section-title">🤖 Gợi Ý AI</h3>
          <p>{insights.recommendation}</p>
        </div>
      )}

    </div>
  )
}
import React, { useState } from 'react'
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
          <h3 className="kpi-value">2,450</h3>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">🎯 Độ Chính Xác TB</p>
          <h3 className="kpi-value">86.5%</h3>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">⏱️ Thời Gian TB</p>
          <h3 className="kpi-value">45 phút</h3>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">📈 Tiến Độ TB</p>
          <h3 className="kpi-value">72%</h3>
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
              <PerformanceRow className="Anh 10A" excellent={40} good={35} average={20} poor={5} />
              <PerformanceRow className="Toán 10B" excellent={25} good={45} average={25} poor={5} />
              <PerformanceRow className="Hóa 11" excellent={50} good={30} average={15} poor={5} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
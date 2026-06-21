import React, { useState } from 'react'
import './ClassesPage.css'

function ClassCard({ name, students, status, progress, lastActivity }) {
  return (
    <div className="class-card">
      <div className="class-header">
        <h3 className="class-name">{name}</h3>
        <span className={`class-status ${status}`}>
          {status === 'active' ? '🟢 Hoạt động' : '🔴 Tạm dừng'}
        </span>
      </div>
      <div className="class-info">
        <div className="info-item">
          <span className="info-label">👥 Học sinh:</span>
          <span className="info-value">{students}</span>
        </div>
        <div className="info-item">
          <span className="info-label">📅 Cuối cùng:</span>
          <span className="info-value">{lastActivity}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">{progress}% hoàn thành</p>
    </div>
  )
}

export default function ClassesPage() {
  const [search, setSearch] = useState('')

  const classes = [
    { name: 'Lớp Tiếng Anh 10A', students: 35, status: 'active', progress: 85, lastActivity: '2 giờ trước' },
    { name: 'Lớp Tiếng Anh 10B', students: 30, status: 'active', progress: 72, lastActivity: '4 giờ trước' },
    { name: 'Lớp Tiếng Trung A', students: 28, status: 'active', progress: 95, lastActivity: '1 giờ trước' },
    { name: 'Lớp Tiếng Anh 11A', students: 32, status: 'inactive', progress: 45, lastActivity: '3 ngày trước' },
    { name: 'Lớp Tiếng Trung B', students: 25, status: 'active', progress: 88, lastActivity: 'Hôm nay' },
    { name: 'Lớp Tiếng Anh 11B', students: 30, status: 'active', progress: 80, lastActivity: '5 giờ trước' },
  ]

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="classes-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Lớp Học</h1>
          <p className="page-subtitle">Quản lý tất cả lớp học của bạn</p>
        </div>
        <button className="btn-primary">+ Tạo Lớp Mới</button>
      </div>

      {/* Search & Filter */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm lớp học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select className="filter-select">
          <option>Tất cả</option>
          <option>Hoạt động</option>
          <option>Tạm dừng</option>
        </select>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {filteredClasses.map((cls, idx) => (
          <ClassCard key={idx} {...cls} />
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="empty-state">
          <p>😕 Không tìm thấy lớp học</p>
        </div>
      )}
    </div>
  )
}
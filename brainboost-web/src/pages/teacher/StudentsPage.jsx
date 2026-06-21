import React, { useState } from 'react'
import './StudentsPage.css'

function StudentRow({ avatar, name, email, className, progress, accuracy, status }) {
  return (
    <tr className="student-row">
      <td className="col-student">
        <div className="student-cell">
          <div className="student-avatar-icon">👤</div>
          <div>
            <p className="student-name">{name}</p>
            <p className="student-email">{email}</p>
          </div>
        </div>
      </td>

      <td className="col-class">{className}</td>

      <td className="col-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">{progress}%</span>
      </td>

      <td className="col-accuracy">{accuracy}%</td>

      <td className="col-status">
        <span className={`status-badge ${status}`}>
          {status === 'excellent' && '🌟 Xuất Sắc'}
          {status === 'good' && '👍 Tốt'}
          {status === 'average' && '📊 Trung Bình'}
          {status === 'at-risk' && '⚠️ Cần Hỗ Trợ'}
        </span>
      </td>
    </tr>
  )
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')

  const students = [
    { name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', className: 'Lớp Anh 10A', progress: 95, accuracy: 98, status: 'excellent' },
    { name: 'Huyền Trang', email: 'trang@gmail.com', className: 'Lớp Anh 10A', progress: 88, accuracy: 92, status: 'good' },
    { name: 'Trinh', email: 'trinh@gmail.com', className: 'Lớp Toán 10B', progress: 76, accuracy: 85, status: 'average' },
  ]

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="students-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Học Sinh</h1>
          <p className="page-subtitle">Quản lý và theo dõi tiến độ học sinh</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm học sinh..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th className="col-student">Học Sinh</th>
              <th className="col-class">Lớp</th>
              <th className="col-progress">Tiến Độ</th>
              <th className="col-accuracy">Độ Chính Xác</th>
              <th className="col-status">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <StudentRow key={idx} {...student} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
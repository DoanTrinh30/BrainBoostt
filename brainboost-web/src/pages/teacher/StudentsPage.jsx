import React, { useState } from 'react'
import './StudentsPage.css'

function StudentRow({ avatar, name, email, className, progress, accuracy, status }) {
  return (
    <tr className="student-row">
      <td className="col-student">
        <div className="student-cell">
          <img src={avatar} alt={name} className="student-avatar" />
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
    { avatar: 'https://i.pravatar.cc/40?img=1', name: 'Nguyễn Văn A', email: 'nguyenvana@school.edu', className: 'Lớp Anh 10A', progress: 95, accuracy: 98, status: 'excellent' },
    { avatar: 'https://i.pravatar.cc/40?img=2', name: 'Trần Thị B', email: 'tranthib@school.edu', className: 'Lớp Anh 10A', progress: 88, accuracy: 92, status: 'good' },
    { avatar: 'https://i.pravatar.cc/40?img=3', name: 'Lê Văn C', email: 'levanc@school.edu', className: 'Lớp Toán 10B', progress: 76, accuracy: 85, status: 'average' },
    { avatar: 'https://i.pravatar.cc/40?img=4', name: 'Phạm Thị D', email: 'phamthid@school.edu', className: 'Lớp Toán 10B', progress: 62, accuracy: 72, status: 'at-risk' },
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
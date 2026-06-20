import React, { useState } from 'react'
import './ProfilePage.css'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'Trịnh Văn A',
    email: 'trinh@gmail.com',
    phone: '0912345678',
    bio: 'Giáo viên Tiếng Anh tại trường...',
    department: 'Khoa Ngoại Ngữ',
    experience: '5 năm',
    subjects: ['Tiếng Anh', 'Tiếng Pháp'],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h1 className="profile-name">{formData.fullName}</h1>
          <p className="profile-role">Giáo Viên</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Personal Info */}
        <div className="profile-section">
          <h2 className="section-title">📋 Thông Tin Cá Nhân</h2>
          <form className="form">
            <div className="form-group">
              <label>Họ và Tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Số Điện Thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tiểu Sử</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4"></textarea>
            </div>
            <button type="submit" className="btn-save">💾 Lưu Thay Đổi</button>
          </form>
        </div>

        {/* Teaching Info */}
        <div className="profile-section">
          <h2 className="section-title">🎓 Thông Tin Giảng Dạy</h2>
          <form className="form">
            <div className="form-group">
              <label>Bộ Môn</label>
              <input type="text" value={formData.department} readOnly />
            </div>
            <div className="form-group">
              <label>Kinh Nghiệm (năm)</label>
              <input type="text" value={formData.experience} readOnly />
            </div>
            <div className="form-group">
              <label>Môn Học</label>
              <div className="tags">
                {formData.subjects.map((subject, idx) => (
                  <span key={idx} className="tag">{subject}</span>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Security */}
      <div className="profile-section">
        <h2 className="section-title">🔐 Bảo Mật</h2>
        <form className="form">
          <div className="form-group">
            <label>Mật Khẩu Hiện Tại</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Mật Khẩu Mới</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Xác Nhận Mật Khẩu</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-save">🔄 Cập Nhật Mật Khẩu</button>
        </form>
      </div>
    </div>
  )
}
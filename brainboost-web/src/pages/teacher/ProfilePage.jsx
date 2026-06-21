import React, { useState, useEffect } from 'react'
import { profileService } from '../../services/profileService'
import './ProfilePage.css'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    department: '',
    experience: '',
    subjects: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await profileService.getProfile()
      console.log('Profile data:', data)

      setFormData(prev => ({
        ...prev,
        fullName: data.name || data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        department: data.department || '',
        experience: data.experience || '',
        subjects: data.subjects || []
      }))
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Không thể tải thông tin profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitProfile = async (e) => {
    e.preventDefault()
    try {
      await profileService.updateProfile(formData)
      setMessage({ type: 'success', text: '✅ Cập nhật profile thành công!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ' + err.message })
    }
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()

    if (passwordForm.new !== passwordForm.confirm) {
      setMessage({ type: 'error', text: '❌ Mật khẩu mới không khớp!' })
      return
    }

    try {
      await profileService.changePassword(
        passwordForm.current,
        passwordForm.new
      )

      setPasswordForm({ current: '', new: '', confirm: '' })

      setMessage({
        type: 'success',
        text: '✅ Cập nhật mật khẩu thành công!'
      })

      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ' + err.message })
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <p>⏳ Đang tải...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page">
        <p style={{ color: 'red' }}>❌ {error}</p>
      </div>
    )
  }

  return (
    <div className="profile-page">

      {message && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '4px',
            backgroundColor:
              message.type === 'success' ? '#d4edda' : '#f8d7da',
            color:
              message.type === 'success' ? '#155724' : '#721c24'
          }}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="profile-header">
        <span className="profile-avatar-icon">👤</span>

        <div className="profile-info">
          <h1 className="profile-name">{formData.fullName}</h1>
          <p className="profile-role">Giáo viên</p>
        </div>
      </div>

      <div className="profile-grid">

        {/* Personal Info */}
        <div className="profile-section">
          <h2 className="section-title">📋 Thông Tin Cá Nhân</h2>

          <form className="form" onSubmit={handleSubmitProfile}>
            <div className="form-group">
              <label>Họ và Tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Số Điện Thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tiểu Sử</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <button type="submit" className="btn-save">
              💾 Lưu Thay Đổi
            </button>
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
                {formData.subjects?.map((subject, idx) => (
                  <span key={idx} className="tag">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>

      </div>

      {/* Security */}
      <div className="profile-section">
        <h2 className="section-title">🔐 Bảo Mật</h2>

        <form className="form" onSubmit={handleSubmitPassword}>
          <div className="form-group">
            <label>Mật Khẩu Hiện Tại</label>
            <input
              type="password"
              name="current"
              placeholder="••••••••"
              value={passwordForm.current}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật Khẩu Mới</label>
            <input
              type="password"
              name="new"
              placeholder="••••••••"
              value={passwordForm.new}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Xác Nhận Mật Khẩu</label>
            <input
              type="password"
              name="confirm"
              placeholder="••••••••"
              value={passwordForm.confirm}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button type="submit" className="btn-save">
            🔄 Cập Nhật Mật Khẩu
          </button>
        </form>
      </div>

    </div>
  )
}
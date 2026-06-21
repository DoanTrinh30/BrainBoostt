import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './TopBar.css'

export default function TopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm học sinh, lớp, hoặc bộ thẻ..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon" title="Thông báo">🔔</button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={user?.username || 'User'}
          >
            <span className="profile-avatar-icon">👤</span>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <span className="menu-user-name">{user?.username || 'User'}</span>
                <span className="menu-user-role">Giáo viên</span>
              </div>

              <hr className="menu-divider" />

              <button
                className="menu-item"
                onClick={() => {
                  navigate('/teacher/profile')
                  setShowProfileMenu(false)
                }}
              >
                👤 Hồ Sơ Cá Nhân
              </button>

              <button
                className="menu-item"
                onClick={() => {
                  navigate('/teacher/profile')
                  setShowProfileMenu(false)
                }}
              >
                ⚙️ Cài Đặt
              </button>

              <hr className="menu-divider" />

              <button className="menu-item">? Trợ Giúp</button>

              <button
                className="menu-item logout"
                onClick={handleLogout}
              >
                🚪 Đăng Xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
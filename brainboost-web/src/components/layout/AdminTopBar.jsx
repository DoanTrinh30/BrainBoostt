import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './TopBar.css'

export default function AdminTopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-topbar">
      <div className="topbar-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Tìm kiếm logs, models, hoặc người dùng..."
          className="topbar-input"
        />
      </div>

      <div className="topbar-right">
        <button className="topbar-icon">🔔</button>
        <button className="topbar-icon">❓</button>
        <button className="topbar-icon">⚙️</button>

        {/* Admin Profile Dropdown */}
        <div className="profile-dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-info">
              <span className="profile-name">Alex Rivera</span>
              <span className="profile-level">Admin Console</span>
            </div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Admin"
              className="profile-avatar"
            />
            <span className="dropdown-arrow">▼</span>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <button className="menu-item">👤 Hồ Sơ</button>
              <button className="menu-item">⚙️ Cài Đặt</button>
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

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
            placeholder="      Tìm kiếm học sinh, lớp, hoặc bộ thẻ..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon">🔔</button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span className="profile-name">{user?.username || 'User'}</span>
            <span className="profile-role">Giáo viên</span>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'user'}`}
              alt="User"
              className="profile-avatar"
            />
            <span className="dropdown-arrow">▼</span>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
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

import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const teacherMenu = [
  { id: 'dashboard', label: 'Tổng Quan', icon: '📊', path: '/teacher/dashboard' },
  { id: 'classes', label: 'Lớp Học', icon: '🏫', path: '/teacher/classes' },
  { id: 'students', label: 'Học Sinh', icon: '👥', path: '/teacher/students' },
  { id: 'decks', label: 'Bộ Thẻ', icon: '📚', path: '/teacher/decks' },
  { id: 'analytics', label: 'Phân Tích', icon: '📈', path: '/teacher/analytics' },
  { id: 'profile', label: 'Hồ Sơ', icon: '⚙️', path: '/teacher/profile' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📚</div>
        <div>
          <h1>BrainBoost</h1>
          <p>EDUCATOR PORTAL</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {teacherMenu.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <button className="btn-create-class">
        <span>+</span> Tạo Lớp Mới
      </button>
    </aside>
  )
}
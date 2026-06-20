import { Link, useLocation } from 'react-router-dom'
import './AdminSidebar.css'

const adminMenu = [
  { id: 'overview', label: 'System Overview', icon: '📊', path: '/admin/dashboard' },
  { id: 'users', label: 'User Management', icon: '👥', path: '/admin/users' },
  { id: 'performance', label: 'AI Performance', icon: '⚡', path: '/admin/performance' },
  { id: 'settings', label: 'System Settings', icon: '⚙️', path: '/admin/settings' },
]

export default function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h1>BrainBoost</h1>
        <p>ADMIN CONSOLE</p>
      </div>

      <nav className="admin-menu">
        {adminMenu.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`admin-menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="admin-bottom">
        <button className="admin-btn-new">
          <span>+</span> New Report
        </button>
        <button className="admin-help">? Help</button>
        <button className="admin-logout">→ Sign Out</button>
      </div>
    </aside>
  )
}
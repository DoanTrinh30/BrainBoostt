import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
 
export default function Sidebar() {
  const [user] = useState({ role: 'teacher', username: 'Trịnh' })
  const navigate = useNavigate()
  const location = useLocation()
 
  const isAdmin = user?.role === 'admin'
  const menus = isAdmin
    ? [
        { icon: '📊', label: 'Tổng quan', path: '/admin/dashboard' },
        { icon: '👥', label: 'Người dùng', path: '/admin/users' },
        { icon: '🧠', label: 'ML', path: '/admin/ml-monitoring' },
      ]
    : [
        { icon: '🏠', label: 'Tổng quan', path: '/teacher/dashboard' },
        { icon: '📚', label: 'Bộ thẻ', path: '/teacher/decks' },
        { icon: '🏫', label: 'Lớp', path: '/teacher/classes' },
        { icon: '📈', label: 'Phân tích', path: '/teacher/analytics' },
        { icon: '✨', label: 'AI', path: '/teacher/insights' },
        { icon: '👤', label: 'Hồ sơ', path: '/teacher/profile' },
      ]
 
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
 
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600">🧠 BrainBoost</h1>
        <p className="text-xs text-gray-500 mt-1">Learning Platform</p>
      </div>
 
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path
          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{menu.icon}</span>
              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>
 
      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  )
}

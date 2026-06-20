import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ 
  children, 
  requiredRole = null 
}) {
  const { isAuthenticated, role, loading } = useAuth()

  // Đang load
  if (loading) {
    return (
      <div className="loading-screen">
        <p>⏳ Đang tải...</p>
      </div>
    )
  }

  // Chưa login → redirect /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Cần role cụ thể nhưng user không match → redirect dashboard
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard'} replace />
  }

  return children
}
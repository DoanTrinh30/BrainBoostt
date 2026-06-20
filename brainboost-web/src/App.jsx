import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'

// Teacher Pages
import TeacherLayout from './components/layout/TeacherLayout'
import TeacherDashboard from './pages/teacher/DashboardPage'
import TeacherClasses from './pages/teacher/ClassesPage'
import TeacherStudents from './pages/teacher/StudentsPage'
import TeacherDecks from './pages/teacher/DecksPage'
import TeacherAnalytics from './pages/teacher/AnalyticsPage'
import TeacherProfile from './pages/teacher/ProfilePage'

// Admin Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/DashboardPage'
import AdminUsers from './pages/admin/UsersPage'
import AdminPerformance from './pages/admin/PerformancePage'
import SettingsPage from './pages/admin/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* TEACHER ROUTES */}
          <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherLayout><TeacherDashboard /></TeacherLayout></ProtectedRoute>} />
          <Route path="/teacher/classes" element={<ProtectedRoute><TeacherLayout><TeacherClasses /></TeacherLayout></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute><TeacherLayout><TeacherStudents /></TeacherLayout></ProtectedRoute>} />
          <Route path="/teacher/decks" element={<ProtectedRoute><TeacherLayout><TeacherDecks /></TeacherLayout></ProtectedRoute>} />
          <Route path="/teacher/analytics" element={<ProtectedRoute><TeacherLayout><TeacherAnalytics /></TeacherLayout></ProtectedRoute>} />
          <Route path="/teacher/profile" element={<ProtectedRoute><TeacherLayout><TeacherProfile /></TeacherLayout></ProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/performance" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminPerformance /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

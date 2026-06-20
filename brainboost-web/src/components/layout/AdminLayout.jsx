import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import './AdminLayout.css'

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminTopBar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
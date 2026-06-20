import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './TeacherLayout.css'

export default function TeacherLayout({ children }) {
  return (
    <div className="teacher-layout">
      <Sidebar />
      <TopBar />
      <main className="teacher-content">
        {children}
      </main>
    </div>
  )
}
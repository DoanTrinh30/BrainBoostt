import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './MainLayout.css'

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <TopBar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

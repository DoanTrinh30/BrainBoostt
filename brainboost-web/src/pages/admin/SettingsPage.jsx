import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import './AdminSettings.css'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'BrainBoost',
    siteUrl: 'https://brainboost.edu',
    supportEmail: 'support@brainboost.edu',
    timezone: 'UTC+7',
    language: 'Vietnamese',
    maintenanceMode: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    alert('✅ Cài đặt đã được lưu!')
  }

  return (
    <AdminLayout>
      <div className="admin-settings-page">
        <div className="settings-header">
          <h1 className="headline-lg">Cài Đặt Hệ Thống</h1>
          <p className="text-secondary">Quản lý cấu hình hệ thống</p>
        </div>

        <div className="settings-card card">
          <h2 className="card-title">⚙️ Cài Đặt Chung</h2>

          <div className="form-group">
            <label>Tên Trang Web</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label>URL Trang Web</label>
            <input
              type="text"
              name="siteUrl"
              value={settings.siteUrl}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Email Hỗ Trợ</label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Lưu Cài Đặt
          </button>
          <button className="btn btn-secondary">🔄 Đặt Lại</button>
        </div>
      </div>
    </AdminLayout>
  )
}
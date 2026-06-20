import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('trinh@gmail.com')
  const [password, setPassword] = useState('12345')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('🔐 Starting login process...')
      const result = await login(email, password)

      if (result.success) {
        console.log('✅ Login successful, redirecting...')
        // Auto redirect theo role
        if (result.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/teacher/dashboard')
        }
      } else {
        setError(result.error || 'Login failed')
        console.error('❌ Login failed:', result.error)
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧠</div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>BrainBoost</h1>
          <p style={{ color: '#64748b' }}>Educator & Admin Portal</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              color: '#ef4444',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🔓 Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          <p style={{ marginBottom: '8px' }}>Demo Accounts:</p>
          <p>👨‍🏫 Teacher: trinh@gmail.com / 12345</p>
          <p>👨‍💼 Admin: admin@example.com / 12345</p>
        </div>
      </div>
    </div>
  )
}
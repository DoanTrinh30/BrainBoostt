import AdminLayout from '../../components/layout/AdminLayout'
import './AdminPerformance.css'

export default function PerformancePage() {
  return (
    <AdminLayout>
      <div className="perf-page">
        <div className="perf-header">
          <div>
            <h1 className="headline-lg">ML Monitoring Dashboard</h1>
            <p className="text-secondary">Real-time performance metrics for BrainBoost AI core models</p>
          </div>
          <div className="perf-controls">
            <button className="btn-control">📅 Last 24 Hours</button>
            <button className="btn-control">⬇️ Export PDF</button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <p className="metric-label">Model Accuracy</p>
            <div className="metric-trend positive">+0.4%</div>
            <h3 className="metric-value">99.1%</h3>
          </div>
          <div className="metric-card">
            <p className="metric-label">Precision</p>
            <div className="metric-trend positive">+1.2%</div>
            <h3 className="metric-value">98.4%</h3>
          </div>
          <div className="metric-card">
            <p className="metric-label">Recall</p>
            <div className="metric-trend negative">-0.2%</div>
            <h3 className="metric-value">97.8%</h3>
          </div>
          <div className="metric-card">
            <p className="metric-label">F1 Score</p>
            <div className="metric-trend positive">+0.8%</div>
            <h3 className="metric-value">98.1%</h3>
          </div>
        </div>

        {/* Charts */}
        <div className="perf-grid">
          <div className="perf-card">
            <h2 className="card-title">Model Performance Trends</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{background: '#2563eb'}}></span>
                Accuracy
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{background: '#f59e0b'}}></span>
                Loss
              </span>
            </div>
            <div className="chart-placeholder">
              📊 Line chart (Accuracy + Loss over time)
            </div>
          </div>

          <div className="perf-card">
            <h2 className="card-title">Model Health</h2>
            <div className="health-badge">✅ HEALTHY</div>
            <div className="health-items">
              <div className="health-item">
                <p>Latency</p>
                <span>24ms</span>
                <div className="health-bar">
                  <div style={{width: '30%'}}></div>
                </div>
              </div>
              <div className="health-item">
                <p>Throughput</p>
                <span>1.2k req/s</span>
                <div className="health-bar">
                  <div style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="health-item">
                <p>Memory Usage</p>
                <span>64%</span>
                <div className="health-bar">
                  <div style={{width: '64%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Analysis & Logs */}
        <div className="perf-grid">
          <div className="perf-card">
            <h2 className="card-title">Prediction Logs</h2>
            <a href="#" className="view-link">View Live Stream →</a>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Input Sample</th>
                  <th>Predicted Label</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-01-15 14:32:01</td>
                  <td>"Analyze lesson"</td>
                  <td>CONTENT</td>
                  <td>0.98</td>
                  <td><span className="status-ok">✓</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="perf-card">
            <h2 className="card-title">Error Analysis</h2>
            <div className="error-count">124</div>
            <p className="error-label">Total Errors</p>
            <div className="error-breakdown">
              <div className="error-item">
                <span className="error-dot fp"></span>
                False Positives
              </div>
              <div className="error-item">
                <span className="error-dot fn"></span>
                False Negatives
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

import './StudentsTable.css'

const students = [
  { id: 1, name: 'Julian V.', engagement: 'High', accuracy: '99.2%', progress: 95 },
  { id: 2, name: 'Amara S.', engagement: 'Exceptional', accuracy: '98.5%', progress: 98 },
  { id: 3, name: 'Tariq J.', engagement: 'Steady', accuracy: '97.0%', progress: 85 },
  { id: 4, name: 'Chloe M.', engagement: 'Improving', accuracy: '96.8%', progress: 75 },
]

export default function StudentsTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Top Performing Students</h3>
        <button className="table-action">⋮</button>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>STUDENT</th>
            <th>ENGAGEMENT</th>
            <th>ACCURACY</th>
            <th>PROGRESS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="student-name">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                  alt={student.name}
                  className="student-avatar"
                />
                {student.name}
              </td>
              <td>
                <span className="engagement-badge">● {student.engagement}</span>
              </td>
              <td className="accuracy">{student.accuracy}</td>
              <td>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <a href="#">Download Complete Leaderboard (PDF)</a>
      </div>
    </div>
  )
}

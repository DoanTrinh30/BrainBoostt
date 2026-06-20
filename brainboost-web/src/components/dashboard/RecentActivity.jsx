import './RecentActivity.css'

const activities = [
  {
    id: 1,
    icon: '📘',
    title: 'Biology 101 flashcards updated with AI suggestions.',
    time: '2 mins ago',
    detail: '142 cards'
  },
  {
    id: 2,
    icon: '🏆',
    title: 'Leo Maxwell completed Advanced Organic Chem milestone.',
    time: '15 mins ago',
    detail: 'Master Rank'
  },
  {
    id: 3,
    icon: '⚙️',
    title: 'AI curriculum optimization finished for AP Physics.',
    time: '45 mins ago',
    detail: 'Improved +14%'
  },
  {
    id: 4,
    icon: '👥',
    title: '8 new students joined Chemistry Honors.',
    time: '1 hour ago',
    detail: 'Total: 34'
  },
]

export default function RecentActivity() {
  return (
    <div className="activity-card">
      <div className="activity-header">
        <h3>Recent Activities</h3>
        <a href="#" className="view-all">View All</a>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <span className="activity-icon">{activity.icon}</span>
            <div className="activity-content">
              <p className="activity-title">{activity.title}</p>
              <p className="activity-meta">
                {activity.time} • {activity.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
 
export default function UsersPage() {
  const [users] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'teacher', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'teacher', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'user', status: 'inactive' },
  ])
 
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">👥 Người dùng</h1>
 
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} variant="elevated">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                  {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
                <Button variant="danger" size="sm">Ban</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

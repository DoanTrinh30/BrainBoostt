import api from './api'

export const analyticsService = {
  // Lấy thống kê review
  getStats: async () => {
    try {
      const response = await api.get('/api/review-logs/stats')
      console.log('✅ Stats fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      throw error
    }
  },

  // Lấy hoạt động hàng tuần
  getWeeklyActivity: async () => {
    try {
      const response = await api.get('/api/review-logs/weekly-activity')
      console.log('✅ Weekly activity fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching weekly activity:', error)
      throw error
    }
  },

  // Lấy insights từ AI
  getInsights: async () => {
    try {
      const response = await api.get('/api/review-logs/insights')
      console.log('✅ Insights fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching insights:', error)
      throw error
    }
  },

  // Lấy lịch sử review
  getHistory: async (limit = 20) => {
    try {
      const response = await api.get(`/api/review-logs/history?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching history:', error)
      throw error
    }
  },

  // Lấy recommendation từ ML
  getRecommendations: async (limit = 10) => {
    try {
      const response = await api.get(`/api/review-logs/recommend?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching recommendations:', error)
      throw error
    }
  }
}
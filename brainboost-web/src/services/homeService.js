import api from './api'

export const homeService = {
  // Lấy dữ liệu home - decks, folders và classes cho user
  getHomeData: async () => {
    try {
      const response = await api.get('/api/home')
      console.log('✅ Home data fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching home data:', error)
      throw error
    }
  },

  // Tìm kiếm public decks, classes, folders, users
  search: async (keyword, limit = 10) => {
    try {
      const response = await api.get(`/api/search?keyword=${keyword}&limit=${limit}`)
      console.log('✅ Search results:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error searching:', error)
      throw error
    }
  },

  // Lấy tổng số folders
  getTotalFolders: async () => {
    try {
      const response = await api.get('/api/total_folders')
      return response.data
    } catch (error) {
      console.error('❌ Error fetching total folders:', error)
      throw error
    }
  },

  // Lấy tổng số flashcards
  getTotalFlashcards: async () => {
    try {
      const response = await api.get('/api/total_flashcards')
      return response.data
    } catch (error) {
      console.error('❌ Error fetching total flashcards:', error)
      throw error
    }
  }
}
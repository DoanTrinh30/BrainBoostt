import api from './api'

export const deckService = {
  // Lấy danh sách các bộ thẻ
  getAllDecks: async () => {
    try {
      const response = await api.get('/api/decks')
      console.log('✅ Decks fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching decks:', error.response?.data || error.message)
      throw error
    }
  },

  // Lấy chi tiết 1 bộ thẻ
  getDeckById: async (deckId) => {
    try {
      const response = await api.get(`/api/decks/${deckId}`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching deck:', error)
      throw error
    }
  },

  // Lấy flashcards của 1 bộ thẻ
  getFlashcardsByDeck: async (deckId) => {
    try {
      const response = await api.get(`/api/flashcards/${deckId}`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching flashcards:', error)
      throw error
    }
  },

  // Tạo bộ thẻ mới
  createDeck: async (deckData) => {
    try {
      const response = await api.post('/api/decks', deckData)
      return response.data
    } catch (error) {
      console.error('❌ Error creating deck:', error)
      throw error
    }
  },

  // Cập nhật bộ thẻ
  updateDeck: async (deckId, deckData) => {
    try {
      const response = await api.put(`/api/decks/${deckId}`, deckData)
      return response.data
    } catch (error) {
      console.error('❌ Error updating deck:', error)
      throw error
    }
  },

  // Xóa bộ thẻ
  deleteDeck: async (deckId) => {
    try {
      const response = await api.delete(`/api/decks/${deckId}`)
      return response.data
    } catch (error) {
      console.error('❌ Error deleting deck:', error)
      throw error
    }
  }
}
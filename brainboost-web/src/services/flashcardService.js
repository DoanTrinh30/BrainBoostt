import api from './api'

export const flashcardService = {
  // Lấy flashcards theo bộ thẻ
  getFlashcardsByDeck: async (deckId) => {
    try {
      const response = await api.get(`/api/decks/${deckId}/flashcards`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching flashcards:', error)
      throw error
    }
  },

  // Tạo flashcard mới
  createFlashcard: async (deckId, flashcardData) => {
    try {
      const response = await api.post(`/api/decks/${deckId}/flashcards`, flashcardData)
      return response.data
    } catch (error) {
      console.error('❌ Error creating flashcard:', error)
      throw error
    }
  },

  // Cập nhật flashcard
  updateFlashcard: async (flashcardId, flashcardData) => {
    try {
      const response = await api.put(`/api/flashcards/${flashcardId}`, flashcardData)
      return response.data
    } catch (error) {
      console.error('❌ Error updating flashcard:', error)
      throw error
    }
  },

  // Xóa flashcard
  deleteFlashcard: async (flashcardId) => {
    try {
      const response = await api.delete(`/api/flashcards/${flashcardId}`)
      return response.data
    } catch (error) {
      console.error('❌ Error deleting flashcard:', error)
      throw error
    }
  }
}
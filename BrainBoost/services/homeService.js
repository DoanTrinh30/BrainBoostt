import axios from 'axios'
import serverApi from '../helpers/axios'

export const getHomeData = async () => {
    try {
        const response = await serverApi.get('/api/home')
        return response.data.data
    } catch (error) {
        console.error('Error fetching home data:', error)
        throw error
    }
}

export const generateDeckWithAI = async (params = {}) => {
    try {
        const {
            topic = 'capitals of Southeast Asia',
            level = 'beginner',
            quantity = 10,
        } = params

        const response = await serverApi.post(
            '/ai/flashcards/auto-generate',
            {
                topic,
                level,
                quantity,
            },
            { timeout: 1000000 },
        )
        return response.data.response
    } catch (error) {
        console.error('Error generating deck with AI:', error)
        throw error
    }
}

export const generateDistractors = async (flashcards) => {
    try {
        const payload = {
            questions: flashcards?.map((flashcard) => flashcard.frontText),
            answers: flashcards?.map((flashcard) => flashcard.backText),
        }
        const response = await serverApi.post(
            '/ai/flashcards/generate-distractors',
            payload,
            { timeout: 1000000 },
        )
        console.log('Generated distractors:', response.data.response)
        return response.data.response
    } catch (error) {
        console.error('Error generating distractors:', error)
        throw error
    }
}

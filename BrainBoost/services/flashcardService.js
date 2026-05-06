import serverApi from '../helpers/axios';

export const getTotalFlashcards = async () => {
    try {
        const response = await serverApi.get('/api/total_flashcards');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all decks:', error);
        throw error;
    }
};
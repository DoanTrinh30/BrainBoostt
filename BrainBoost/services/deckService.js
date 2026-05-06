import serverApi from '../helpers/axios';

export const getAllDecks = async () => {
    try {
        const response = await serverApi.get('/api/decks');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all decks:', error);
        throw error;
    }
};

export const getDeckById = async (id) => {
    try {
        const response = await serverApi.get(`/api/decks/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching deck with ID ${id}:`, error);
        throw error;
    }
};

export const createDeck = async (deckData) => {
    try {
        const response = await serverApi.post('/api/decks', deckData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating deck:', error);
        throw error;
    }
};

export const updateDeck = async (id, deckData) => {
    try {
        const response = await serverApi.put(`/api/decks/${id}`, deckData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating deck with ID ${id}:`, error);
        if (error.response && error.response.status === 403) {
            const errorMessage =
                error.response.data?.message || 'You do not have permission to update this deck';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const createFlashcards = async (deckId, flashcards) => {
    try {
        const response = await serverApi.post(`/api/decks/${deckId}/flashcards`, { flashcards });
        return response.data.data;
    } catch (error) {
        console.error('Error creating flashcards:', error);
        throw error;
    }
};

export const updateFlashcard = async (flashcardId, flashcardData) => {
    try {
        const response = await serverApi.put(`/api/flashcards/${flashcardId}`, flashcardData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating flashcard with ID ${flashcardId}:`, error);
        if (error.response && error.response.status === 403) {
            const errorMessage =
                error.response.data?.message ||
                'You do not have permission to update this flashcard';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const getFlashcardsById = async (deckId) => {
    try {
        const response = await serverApi.get(`/api/flashcards/${deckId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching flashcards for deck ${deckId}:`, error);
        throw error;
    }
};

export const getAllFolders = async () => {
    try {
        const response = await serverApi.get('/api/folders');
        return response.data;
    } catch (error) {
        console.error('Error fetching folders:', error);
        throw error;
    }
};

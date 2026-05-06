import Toast from 'react-native-toast-message';

/**
 * Toggles deck visibility between public and private
 *
 * @param {Function} setDeckInfo - setState function for deckInfo state
 * @returns {void}
 */
export const toggleVisibility = (setDeckInfo) => {
    setDeckInfo((prevInfo) => ({
        ...prevInfo,
        visibility: prevInfo.visibility === 'public' ? 'private' : 'public',
    }));
};

/**
 * Handles flashcard changes (term or definition)
 *
 * @param {number|string} id - Flashcard ID
 * @param {string} field - Field to update ('term' or 'definition')
 * @param {string} value - New value
 * @param {Function} setDeckInfo - setState function for deckInfo state
 * @returns {void}
 */
export const handleFlashcardChange = (id, field, value, setDeckInfo) => {
    setDeckInfo((prevInfo) => ({
        ...prevInfo,
        flashcards: prevInfo.flashcards.map((card) =>
            card.id === id ? { ...card, [field]: value } : card
        ),
    }));

    Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Flashcard updated successfully!',
        position: 'top',
    });
};

/**
 * Adds a new flashcard pair
 *
 * @param {Function} setDeckInfo - setState function for deckInfo state
 * @returns {void}
 */
export const addFlashcardPair = (setDeckInfo) => {
    const newCard = { id: Date.now(), term: '', definition: '' };

    setDeckInfo((prevInfo) => ({
        ...prevInfo,
        flashcards: [...prevInfo.flashcards, newCard],
    }));

    Toast.show({
        type: 'success',
        text1: 'Flashcards added!',
        text2: 'Your flashcards have been successfully added to this deck.',
        position: 'top',
    });
};

/**
 * Deletes a flashcard pair
 *
 * @param {number|string} id - ID of flashcard to delete
 * @param {Object} deckInfo - Current deckInfo state object with flashcards array
 * @param {Function} setDeckInfo - setState function for deckInfo state
 * @returns {void}
 */
export const deleteFlashcardPair = (id, deckInfo, setDeckInfo) => {
    // Validate that at least one flashcard remains
    if (deckInfo.flashcards.length <= 1) {
        Toast.show({
            type: 'info',
            text1: 'At least one flashcard is required',
            position: 'bottom',
        });
        return;
    }

    setDeckInfo((prevInfo) => ({
        ...prevInfo,
        flashcards: prevInfo.flashcards.filter((card) => card.id !== id),
    }));

    Toast.show({
        type: 'success',
        text1: 'Flashcard deleted successfully!',
        position: 'top',
    });
};

/**
 * Validates deck data before submission
 *
 * @param {Object} deckInfo - The deckInfo state object containing title, description, and flashcards
 * @returns {boolean} - Returns true if valid, false otherwise
 */
export const validateDeckData = (deckInfo) => {
    const { title, description, flashcards } = deckInfo;

    if (!title || title.trim() === '') {
        Toast.show({
            type: 'error',
            text1: 'Title is required',
            position: 'bottom',
        });
        return false;
    }

    if (!description || description.trim() === '') {
        Toast.show({
            type: 'error',
            text1: 'Description is required',
            position: 'bottom',
        });
        return false;
    }

    const validFlashcards = flashcards.filter(
        (card) => card.term.trim() !== '' && card.definition.trim() !== ''
    );

    if (validFlashcards.length === 0) {
        Toast.show({
            type: 'error',
            text1: 'At least one complete flashcard is required',
            position: 'bottom',
        });
        return false;
    }

    return true;
};

/**
 * Helper functions for the test screen
 */

/**
 * Generates wrong options for multiple choice questions
 * @param {string} correctAnswer - The correct answer
 * @param {Array} allFlashcards - All flashcards array
 * @param {number} count - Number of wrong options to generate
 * @returns {Array} - Array of wrong options
 */
export const generateWrongOptions = (correctAnswer, allFlashcards, count) => {
    const otherAnswers = allFlashcards
        .filter((card) => card.backText !== correctAnswer)
        .map((card) => card.backText)

    if (otherAnswers.length < count) {
        // Not enough other answers, generate some variations
        const additionalAnswers = Array(count - otherAnswers.length)
            .fill(0)
            .map(() => generateWrongAnswer(correctAnswer, allFlashcards))

        return [...otherAnswers, ...additionalAnswers].slice(0, count)
    }

    // Shuffle and return the first 'count' answers
    return [...otherAnswers].sort(() => Math.random() - 0.5).slice(0, count)
}

/**
 * Generates a wrong answer for test questions
 * @param {string} correctAnswer - The correct answer
 * @param {Array} allFlashcards - All flashcards array
 * @returns {string} - A wrong answer
 */
export const generateWrongAnswer = (correctAnswer, allFlashcards) => {
    const otherAnswers = allFlashcards
        .filter((card) => card.backText !== correctAnswer)
        .map((card) => card.backText)

    if (otherAnswers.length > 0) {
        return otherAnswers[Math.floor(Math.random() * otherAnswers.length)]
    }

    // Fallback if no other answers available
    return `Not ${correctAnswer}`
}

/**
 * Generate test questions from flashcards based on configuration
 * @param {Array} flashcards - Array of flashcards to create questions from
 * @param {number} questionCount - Number of questions to generate
 * @param {boolean} includeTrueFalse - Whether to include true/false questions
 * @param {boolean} includeMultipleChoice - Whether to include multiple choice questions
 * @param {boolean} includeWritten - Whether to include written questions
 * @returns {Array} - Array of generated test questions
 */
export const generateTestQuestions = (
    flashcards,
    questionCount,
    includeTrueFalse = true,
    includeMultipleChoice = false,
    includeWritten = false,
) => {
    if (!flashcards.length) return []

    // -0.5 => 50% KEEP AND -50% CHANGE THE ORDER
    const shuffledFlashcards = [...flashcards].sort(() => Math.random() - 0.5)
    const limitedFlashcards = shuffledFlashcards.slice(
        0,
        Math.min(questionCount, shuffledFlashcards.length),
    )

    return limitedFlashcards.map((card, idx) => {
        const availableTypes = []
        if (includeTrueFalse) availableTypes.push('trueFalse')
        if (includeMultipleChoice) availableTypes.push('multipleChoice')
        if (includeWritten) availableTypes.push('written')

        // Default to trueFalse if no types selected
        if (availableTypes.length === 0) availableTypes.push('trueFalse')

        const questionType =
            availableTypes[Math.floor(Math.random() * availableTypes.length)]

        // Generate question based on type
        switch (questionType) {
            case 'trueFalse':
                // Variable to determine whether to show the correct definition or an alternate one
                const isCorrectDefinition = Math.random() > 0.5

                // Generate an alternate definition if needed
                const alternateDefinition = generateWrongAnswer(
                    card.backText,
                    flashcards,
                )

                const displayedDefinition = isCorrectDefinition
                    ? card.backText
                    : alternateDefinition

                return {
                    id: idx + 1,
                    type: 'trueFalse',
                    flashcard: card,
                    question: `Is "${card.frontText}" correctly defined as "${displayedDefinition}"?`,
                    options: ['True', 'False'],
                    correctAnswer: isCorrectDefinition ? 'True' : 'False',
                    displayedDefinition: displayedDefinition,
                    actualDefinition: card.backText,
                    isCorrectPairing: isCorrectDefinition,
                }

            case 'written':
                return {
                    id: idx + 1,
                    type: 'written',
                    flashcard: card,
                    question: `What is the definition of "${card.frontText}"?`,
                    correctAnswer: card.backText,
                }

            case 'multipleChoice':
            default:
                const wrongOptions = generateWrongOptions(
                    card.backText,
                    flashcards,
                    3,
                )
                const options = [...wrongOptions, card.backText].sort(
                    () => Math.random() - 0.5,
                )

                return {
                    id: idx + 1,
                    type: 'multipleChoice',
                    flashcard: card,
                    question: `What is the definition of "${card.frontText}"?`,
                    options,
                    correctAnswer: card.backText,
                }
        }
    })
}

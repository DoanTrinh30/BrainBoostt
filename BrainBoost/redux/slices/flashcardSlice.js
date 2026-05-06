import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    flashcards: [],
    currentFlashcard: null,
    reviewMode: false,
}

const flashcardSlice = createSlice({
    name: 'flashcards',
    initialState,
    reducers: {
        setFlashcards: (state, action) => {
            state.flashcards = action.payload
        },
        setCurrentFlashcard: (state, action) => {
            state.currentFlashcard = action.payload
        },
        setReviewMode: (state, action) => {
            state.reviewMode = action.payload
        },
        clearFlashcards: (state) => {
            state.flashcards = []
            state.currentFlashcard = null
            state.reviewMode = false
        },
    },
})

export const {
    setFlashcards,
    setCurrentFlashcard,
    setReviewMode,
    clearFlashcards,
} = flashcardSlice.actions

export default flashcardSlice.reducer

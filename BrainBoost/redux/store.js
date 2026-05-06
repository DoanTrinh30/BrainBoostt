import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import flashcardReducer from './slices/flashcardSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        flashcards: flashcardReducer,
    },
})

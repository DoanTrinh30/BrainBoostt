import axios from 'axios'
import serverApi from '../helpers/axios'

export const getProfile = async () => {
    try {
        const response = await serverApi.get('/api/profile')
        return response.data.data
    } catch (error) {
        if (error.response) {
            throw new Error(
                error.response.data?.message ||
                    'Failed to fetch profile. Please try again.',
            )
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to server.')
        } else {
            throw new Error(
                'An unexpected error occurred while fetching profile.',
            )
        }
    }
}

export const updateProfile = async ({ username, email, dob }) => {
    try {
        const response = await serverApi.put('/api/profile', {
            username,
            email,
            dob,
        })
        return response.data.data // Trả về dữ liệu người dùng đã cập nhật
    } catch (error) {
        if (error.response) {
            throw new Error(
                error.response.data?.message ||
                    'Failed to update profile. Please try again.',
            )
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to server.')
        } else {
            throw new Error(
                'An unexpected error occurred while updating profile.',
            )
        }
    }
}

export const updateAvatar = async (avatar_url) => {
    try {
        const response = await serverApi.put('/api/profile', { avatar_url })
        return response.data.data
    } catch (error) {
        if (error.response) {
            throw new Error(
                error.response.data?.message ||
                    'Failed to update avatar. Please try again.',
            )
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to server.')
        } else {
            throw new Error(
                'An unexpected error occurred while updating avatar.',
            )
        }
    }
}

export const getQuote = async () => {
    try {
        const response = await axios.get('https://zenquotes.io/api/today')
        return response.data
    } catch (error) {
        console.log('Error fetching quote:', error)
        throw new Error(
            error.response?.data?.message ||
                'Failed to fetch quote. Please try again.',
        )
    }
}

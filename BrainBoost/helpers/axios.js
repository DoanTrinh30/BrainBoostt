import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { store } from '../redux/store'
import { logout } from '../redux/slices/authSlice'

const serverApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BRAIN_BOOST_SERVER_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

serverApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('token')
            store.dispatch(logout())
        }
        return Promise.reject(error)
    },
)

serverApi.interceptors.request.use(
    async (config) => {
        if (
            config.url?.includes('/auth/signin') ||
            config.url?.includes('/auth/signup')
        ) {
            return config
        }

        const token = await AsyncStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default serverApi

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useSegments } from 'expo-router'
import { jwtDecode } from 'jwt-decode'

export function useProtectedRoute() {
    const [isLoading, setIsLoading] = useState(true)
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
    const authToken = useSelector((state) => state.auth.accessToken)
    const segments = useSegments()
    const router = useRouter()

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token)
            const currentTime = Date.now() / 1000
            return decodedToken.exp < currentTime
        } catch (error) {
            return true
        }
    }

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const seen = await AsyncStorage.getItem('hasSeenOnboarding')
                setHasSeenOnboarding(seen === 'true')
            } catch (e) {
                console.error('Failed to load onboarding status', e)
                setHasSeenOnboarding(false)
            } finally {
                setIsLoading(false)
            }
        }
        checkStatus()
    }, [])

    useEffect(() => {
        if (isLoading) {
            return
        }

        const inAuthGroup = segments[0] === 'auth'
        const inOnboardingGroup = segments[0] === 'onboarding'

        // Check if token is expired
        if (authToken && isTokenExpired(authToken)) {
            AsyncStorage.removeItem('token')
            router.replace('/auth/login')
            return
        }

        if (!hasSeenOnboarding && !inOnboardingGroup) {
            router.replace('/onboarding/onboarding01')
        } else if (
            hasSeenOnboarding &&
            !authToken &&
            !inAuthGroup &&
            !inOnboardingGroup
        ) {
            router.replace('/auth/login')
        } else if (
            hasSeenOnboarding &&
            authToken &&
            (inAuthGroup || inOnboardingGroup)
        ) {
            router.replace('/(tabs)')
        }
    }, [isLoading, hasSeenOnboarding, authToken, segments, router])

    return { isLoading, hasSeenOnboarding, authToken }
}

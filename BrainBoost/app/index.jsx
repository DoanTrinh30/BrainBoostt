import { useQuery } from '@tanstack/react-query'
import { Redirect } from 'expo-router'
import { fetchAccessToken } from '../services/authService'
import { ActivityIndicator } from 'react-native'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../redux/slices/authSlice'

export default function Index() {
    const dispatch = useDispatch()

    const { data, isLoading } = useQuery({
        queryKey: ['auth'],
        queryFn: fetchAccessToken,
        staleTime: 1000 * 60 * 60 * 24,
    })

    useEffect(() => {
        if (data?.token) {
            dispatch(setCredentials({ accessToken: data.token }))
        }
    }, [data, dispatch])

    if (isLoading)
        return (
            <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{ flex: 1, justifyContent: 'center' }}
            />
        )

    if (data?.token) return <Redirect href="/bottom/home" />

    return <Redirect href="/onboarding" />
}

import { router, Stack } from 'expo-router'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEffect } from 'react'

const queryClient = new QueryClient()

const toastConfig = {
    position: 'top',
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="bottom" />
                            <Stack.Screen name="onboarding" />
                            <Stack.Screen name="auth" />
                            <Stack.Screen name="decks" />
                            <Stack.Screen name="learning" />
                            <Stack.Screen name="result" />
                            <Stack.Screen name="user" />
                            <Stack.Screen name="search" />
                        </Stack>
                    </Provider>
                </QueryClientProvider>
                <Toast config={toastConfig} />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

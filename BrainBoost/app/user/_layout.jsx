import { Stack } from 'expo-router'

export default function UserLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="setting" />
            <Stack.Screen name="editprofile" />
            <Stack.Screen name="changepassword" />
        </Stack>
    )
}

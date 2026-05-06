import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SettingItem from '../../components/containers/SettingItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import Toast from 'react-native-toast-message'

export default function SettingsScreen() {
    const dispatch = useDispatch()
    const router = useRouter()

    const settingsOptions = [
        {
            iconName: 'person-circle-outline',
            label: 'Account Setting',
            onPress: () => router.push('/user/editprofile'),
        },
        {
            iconName: 'key-outline',
            label: 'Change Password',
            onPress: () => router.push('/user/changepassword'),
        },
        {
            iconName: 'shield-checkmark-outline',
            label: 'Privacy',
            onPress: () => {},
        },
        { iconName: 'star-outline', label: 'Feedback', onPress: () => {} },
        {
            iconName: 'information-circle-outline',
            label: 'Help',
            onPress: () => {},
        },
        {
            iconName: 'chatbubble-ellipses-outline',
            label: 'Contact',
            onPress: () => {},
        },
        {
            iconName: 'document-text-outline',
            label: 'Terms of service',
            onPress: () => {},
        },
    ]

    const handleSignOut = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('token')
            dispatch(logout())
            Toast.show({
                type: 'success',
                text1: 'Logout successful',
                text2: 'You have been logged out successfully.',
                position: 'top',
            })
            router.replace('/auth/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }, [])

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => router.back()}
                />
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.box}>
                    {settingsOptions.map((item, index) => (
                        <SettingItem
                            key={index}
                            iconName={item.iconName}
                            label={item.label}
                            onPress={item.onPress}
                        />
                    ))}

                    <TouchableOpacity
                        style={styles.signOutBtn}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginVertical: 10,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    content: {
        paddingHorizontal: 20,
    },

    box: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
    },

    signOutBtn: {
        marginTop: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#a6a6a6',
        borderRadius: 8,
        alignItems: 'center',
    },

    signOutText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '500',
    },
})

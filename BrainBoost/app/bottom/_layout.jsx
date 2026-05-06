import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'
import { useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { OptionModal } from '@/components/others'

export default function TabLayout() {
    const [modalVisible, setModalVisible] = useState(false)
    const router = useRouter()

    const handleAddPress = () => {
        setModalVisible(true)
    }

    const handleCreateDeck = () => {
        setModalVisible(false)
        router.push('/decks/adddeck')
    }

    const handleCloseModal = () => {
        setModalVisible(false)
    }

    const options = useMemo(
        () => [
            {
                icon: 'albums-outline',
                text: 'Deck',
                description: 'Revise material easily',
                onPress: handleCreateDeck,
            },
            {
                icon: 'folder-outline',
                text: 'Folder',
                description: 'Organize your study materials',
                disabled: true,
                onPress: () => {},
            },
            {
                icon: 'people-outline',
                text: 'Class',
                description: 'Share sets and study together',
                disabled: true,
                onPress: () => {},
            },
        ],
        [],
    )

    return (
        <>
            <OptionModal
                options={options}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                headerText="Create a new set"
                handleCloseModal={handleCloseModal}
            />

            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#3D5CFF',
                    tabBarInactiveTintColor: '#929292',
                    tabBarStyle: {
                        height: 70,
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '100%',
                        paddingVertical: 10,
                        elevation: 10,
                        shadowColor: '#FFF',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        borderTopWidth: 1,
                        borderTopColor: '#efefef',
                    },
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="decks"
                    options={{
                        title: 'Decks',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="folder-open"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="add"
                    options={{
                        title: 'Add',
                        tabBarIcon: ({ color }) => (
                            <TouchableOpacity
                                onPress={handleAddPress}
                                activeOpacity={0.8}
                            >
                                <View style={styles.addButtonContainer}>
                                    <View style={styles.addButton}>
                                        <Ionicons
                                            name="add"
                                            color="#FFFFFF"
                                            size={38}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ),
                        tabBarShowLabel: false,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={handleAddPress}
                            />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            // Prevent default navigation
                            e.preventDefault()
                            handleAddPress()
                        },
                    }}
                />
                <Tabs.Screen
                    name="notification"
                    options={{
                        title: 'Notification',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="notifications"
                                size={size}
                                color={color}
                            />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                        headerShown: false,
                    }}
                />
            </Tabs>
        </>
    )
}

const styles = StyleSheet.create({
    addButtonContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3D5CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3D5CFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 40,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalHandleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 15,
        marginBottom: 12,
        backgroundColor: '#F5F7FF',
    },
    optionIconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F3FF',
        borderRadius: 15,
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
    optionTagContainer: {
        backgroundColor: '#EEF1FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    optionTagText: {
        fontSize: 12,
        color: '#3D5CFF',
        fontWeight: '500',
    },
})

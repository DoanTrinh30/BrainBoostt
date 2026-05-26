import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { OptionModal } from '@/components/others'

export default function TabLayout() {
    const [modalVisible, setModalVisible] = useState(false)
    const router = useRouter()

    const handleAddPress = () => setModalVisible(true)

    const handleCreateDeck = () => {
        setModalVisible(false)
        router.push('/decks/adddeck')
    }

    const handleCloseModal = () => setModalVisible(false)

    const options = useMemo(
        () => [
            {
                icon: 'albums-outline',
                text: 'Bộ thẻ',
                description: 'Ôn tập kiến thức dễ dàng',
                onPress: handleCreateDeck,
            },
            {
                icon: 'folder-outline',
                text: 'Thư mục',
                description: 'Sắp xếp tài liệu học tập',
                disabled: true,
                onPress: () => {},
            },
            {
                icon: 'people-outline',
                text: 'Lớp học',
                description: 'Chia sẻ bộ thẻ và học cùng nhau',
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
                headerText="Tạo mới"
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
                        title: 'Trang chủ',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="decks"
                    options={{
                        title: 'Bộ thẻ',
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
                        title: 'Thêm',
                        tabBarIcon: () => (
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
                            e.preventDefault()
                            handleAddPress()
                        },
                    }}
                />
                <Tabs.Screen
                    name="notification"
                    options={{
                        title: 'Thông báo',
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
                        title: 'Hồ sơ',
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
})
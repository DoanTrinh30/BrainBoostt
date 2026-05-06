import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'reminder',
            title: 'Study Reminder',
            message: "You haven't studied your 'JavaScript Basics' deck today!",
            time: '2 hours ago',
            isRead: false,
        },
        {
            id: '2',
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: 'You completed a 5-day study streak!',
            time: '1 day ago',
            isRead: false,
        },
        {
            id: '3',
            type: 'update',
            title: 'Deck Updated',
            message:
                'Your shared deck "React Hooks" was updated with 5 new cards',
            time: '2 days ago',
            isRead: true,
        },
        {
            id: '4',
            type: 'social',
            title: 'New Follower',
            message: 'Alex started following your progress',
            time: '3 days ago',
            isRead: true,
        },
        {
            id: '5',
            type: 'reminder',
            title: 'Weekly Review',
            message: "It's time for your weekly review of Biology concepts",
            time: '4 days ago',
            isRead: true,
        },
    ])

    const markAsRead = (id) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification,
            ),
        )
    }

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                isRead: true,
            })),
        )
    }

    const renderNotificationItem = ({ item }) => {
        const getIconByType = () => {
            switch (item.type) {
                case 'reminder':
                    return <Ionicons name="time" size={24} color="#3D5CFF" />
                case 'achievement':
                    return <Ionicons name="trophy" size={24} color="#FFD700" />
                case 'update':
                    return (
                        <Ionicons
                            name="refresh-circle"
                            size={24}
                            color="#4CAF50"
                        />
                    )
                case 'social':
                    return <Ionicons name="people" size={24} color="#E91E63" />
                default:
                    return (
                        <Ionicons
                            name="notifications"
                            size={24}
                            color="#3D5CFF"
                        />
                    )
            }
        }

        return (
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    !item.isRead && styles.unreadNotification,
                ]}
                onPress={() => markAsRead(item.id)}
            >
                <View style={styles.iconContainer}>{getIconByType()}</View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationMessage}>
                        {item.message}
                    </Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        )
    }

    const getUnreadCount = () => {
        return notifications.filter((notification) => !notification.isRead)
            .length
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {getUnreadCount() > 0 && (
                        <TouchableOpacity onPress={markAllAsRead}>
                            <Text style={styles.markAllAsRead}>
                                Mark all as read
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {notifications.length > 0 ? (
                    <FlatList
                        data={notifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="notifications-off"
                            size={80}
                            color="#ccc"
                        />
                        <Text style={styles.emptyStateText}>
                            No notifications yet
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    markAllAsRead: {
        color: '#3D5CFF',
        fontSize: 14,
        fontWeight: '500',
    },
    badge: {
        backgroundColor: '#3D5CFF',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    list: {
        paddingBottom: 30,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 25,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    unreadNotification: {
        backgroundColor: '#F0F4FF',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3D5CFF',
        alignSelf: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
    },
})

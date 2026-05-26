import React, { useState, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
// ===== ML INTEGRATION =====
import {
    getRecommendations,
    getReviewStats,
    getWeeklyActivity,
    getAIInsights,
} from '../../services/reviewLogService'

export default function NotificationScreen() {
    const router = useRouter()
    const [readIds, setReadIds] = useState([])

    // ===== ML: Fetch data từ 4 endpoints =====
    const {
        data: recommendData,
        isLoading: isLoadingRecommend,
        refetch: refetchRecommend,
    } = useQuery({
        queryKey: ['mlRecommendations'],
        queryFn: () => getRecommendations(10),
        staleTime: 30 * 1000,
    })

    const {
        data: reviewStats,
        isLoading: isLoadingStats,
        refetch: refetchStats,
    } = useQuery({
        queryKey: ['reviewStats'],
        queryFn: getReviewStats,
        staleTime: 30 * 1000,
    })

    const {
        data: weeklyData,
        isLoading: isLoadingWeekly,
        refetch: refetchWeekly,
    } = useQuery({
        queryKey: ['weeklyActivity'],
        queryFn: getWeeklyActivity,
        staleTime: 30 * 1000,
    })

    const {
        data: insights,
        isLoading: isLoadingInsights,
        refetch: refetchInsights,
    } = useQuery({
        queryKey: ['aiInsights'],
        queryFn: getAIInsights,
        staleTime: 30 * 1000,
    })

    const isLoading =
        isLoadingRecommend ||
        isLoadingStats ||
        isLoadingWeekly ||
        isLoadingInsights

    // ===== Sinh notifications từ ML data =====
    const notifications = useMemo(() => {
        const list = []

        // 1. ML Recommend - flashcards sắp quên
        if (recommendData?.recommendations?.length > 0) {
            const cards = recommendData.recommendations
            const avgForget =
                cards.reduce(
                    (sum, r) => sum + (1 - r.retentionProbability),
                    0
                ) / cards.length
            const forgetPercent = Math.round(avgForget * 100)
            const urgentNames = cards
                .slice(0, 3)
                .map((c) => `"${c.flashcard?.frontText || '?'}"`)
                .join(', ')

            list.push({
                id: 'ml-recommend',
                type: 'reminder',
                icon: 'sparkles',
                iconColor: '#3D5CFF',
                title: `🧠 AI gợi ý ôn tập`,
                message: `Bạn có ${cards.length} từ vựng sắp quên (${forgetPercent}% khả năng quên). Cần ôn: ${urgentNames}${cards.length > 3 ? '...' : ''}`,
                time: 'Vừa xong',
                actionLabel: 'Ôn ngay',
                onAction: () => {
                    const flashcardsToReview = cards
                        .filter((r) => r.flashcard)
                        .map((r) => ({
                            id: r.flashcard.id,
                            frontText: r.flashcard.frontText,
                            backText: r.flashcard.backText,
                            imageUrl: r.flashcard.imageUrl,
                        }))

                    if (flashcardsToReview.length === 0) return

                    router.push({
                        pathname: '/learning/flashcard',
                        params: {
                            flashcards: JSON.stringify(flashcardsToReview),
                            deckName: '🧠 AI gợi ý ôn tập',
                            deckId: '',
                        },
                    })
                },
            })
        }

        // 2. Streak Achievement
        if (insights?.currentStreak >= 2) {
            list.push({
                id: 'streak',
                type: 'achievement',
                icon: 'flame',
                iconColor: '#FF6B35',
                title: `🔥 Streak ${insights.currentStreak} ngày!`,
                message: `Tuyệt vời! Bạn đã học liên tiếp ${insights.currentStreak} ngày. Hãy tiếp tục giữ phong độ nhé!`,
                time: 'Hôm nay',
                actionLabel: 'Xem profile',
                onAction: () => router.push('/bottom/profile'),
            })
        }

        // 3. Weekly Report
        if (weeklyData && Array.isArray(weeklyData) && weeklyData.length > 0) {
            const weekTotal = weeklyData.reduce((sum, d) => sum + d.count, 0)
            const weekCorrect = weeklyData.reduce(
                (sum, d) => sum + d.correctCount,
                0
            )
            if (weekTotal > 0) {
                const weekAccuracy = Math.round(
                    (weekCorrect / weekTotal) * 100
                )
                list.push({
                    id: 'weekly-report',
                    type: 'update',
                    icon: 'bar-chart',
                    iconColor: '#33D9A6',
                    title: '📊 Báo cáo tuần',
                    message: `Tuần qua bạn đã ôn ${weekTotal} lượt với độ chính xác ${weekAccuracy}%. ${
                        weekAccuracy >= 70
                            ? 'Học rất tốt!'
                            : 'Hãy cố gắng hơn nhé!'
                    }`,
                    time: '1 ngày trước',
                    actionLabel: 'Chi tiết',
                    onAction: () => router.push('/bottom/profile'),
                })
            }
        }

        // 4. Best Time of Day
        if (insights?.bestTimeOfDay) {
            const { hour, label, accuracy } = insights.bestTimeOfDay
            list.push({
                id: 'best-time',
                type: 'insight',
                icon: 'time',
                iconColor: '#8B5CF6',
                title: '⏰ Thời điểm vàng',
                message: `AI phát hiện bạn học hiệu quả nhất vào ${label} (${hour}:00) với độ chính xác ${Math.round(
                    accuracy * 100
                )}%. Thử ôn vào giờ này để tăng hiệu quả!`,
                time: '2 ngày trước',
            })
        }

        // 5. Welcome notification nếu chưa có review log nào
        const totalReviews = reviewStats?.totalReviews || 0
        if (totalReviews === 0 && !isLoading) {
            list.push({
                id: 'welcome',
                type: 'reminder',
                icon: 'rocket',
                iconColor: '#3D5CFF',
                title: '🚀 Chào mừng đến BrainBoost!',
                message:
                    'Hãy bắt đầu học flashcards đầu tiên để AI có thể phân tích và cá nhân hóa lộ trình học tập cho bạn.',
                time: 'Vừa xong',
                actionLabel: 'Khám phá decks',
                onAction: () => router.push('/bottom/home'),
            })
        }

        return list
    }, [recommendData, reviewStats, weeklyData, insights, isLoading, router])

    // ===== Mark as read =====
    const markAsRead = (id) => {
        if (!readIds.includes(id)) {
            setReadIds([...readIds, id])
        }
    }

    const markAllAsRead = () => {
        setReadIds(notifications.map((n) => n.id))
    }

    const getUnreadCount = () => {
        return notifications.filter((n) => !readIds.includes(n.id)).length
    }

    // ===== Pull to refresh =====
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = async () => {
        setRefreshing(true)
        await Promise.all([
            refetchRecommend(),
            refetchStats(),
            refetchWeekly(),
            refetchInsights(),
        ])
        setRefreshing(false)
    }

    // ===== Render từng notification =====
    const renderNotificationItem = ({ item }) => {
        const isRead = readIds.includes(item.id)

        return (
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    !isRead && styles.unreadNotification,
                ]}
                onPress={() => {
                    markAsRead(item.id)
                    if (item.onAction) item.onAction()
                }}
                activeOpacity={0.7}
            >
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: `${item.iconColor}15` },
                    ]}
                >
                    <Ionicons
                        name={item.icon}
                        size={22}
                        color={item.iconColor}
                    />
                </View>

                <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                        <Text style={styles.notificationTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {!isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>
                        {item.message}
                    </Text>
                    <View style={styles.bottomRow}>
                        <Text style={styles.notificationTime}>{item.time}</Text>
                        {item.actionLabel && (
                            <Text
                                style={[
                                    styles.actionLabel,
                                    { color: item.iconColor },
                                ]}
                            >
                                {item.actionLabel} →
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // ===== Loading state =====
    if (isLoading && notifications.length === 0) {
        return (
            <SafeAreaView
                style={styles.safeArea}
                edges={['top', 'right', 'left']}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Thông báo</Text>
                    </View>
                    <View style={styles.emptyState}>
                        <ActivityIndicator size="large" color="#3D5CFF" />
                        <Text style={styles.loadingText}>
                            AI đang chuẩn bị thông báo...
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Thông báo</Text>
                        {notifications.length > 0 && (
                            <Text style={styles.headerSubtitle}>
                                AI tạo thông báo dựa trên hoạt động của bạn
                            </Text>
                        )}
                    </View>
                    {getUnreadCount() > 0 && (
                        <TouchableOpacity onPress={markAllAsRead}>
                            <Text style={styles.markAllAsRead}>
                                Đã đọc tất cả
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
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#3D5CFF']}
                                tintColor="#3D5CFF"
                            />
                        }
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="notifications-off-outline"
                            size={80}
                            color="#ccc"
                        />
                        <Text style={styles.emptyStateText}>
                            Chưa có thông báo
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            Hãy bắt đầu học để AI gửi thông báo cho bạn!
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
        alignItems: 'flex-start',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    markAllAsRead: {
        color: '#3D5CFF',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 6,
    },
    list: {
        paddingBottom: 30,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    unreadNotification: {
        backgroundColor: '#F0F4FF',
        borderLeftWidth: 3,
        borderLeftColor: '#3D5CFF',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    notificationContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    notificationMessage: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
        lineHeight: 18,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationTime: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3D5CFF',
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    emptyStateSubtext: {
        marginTop: 6,
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    loadingText: {
        marginTop: 14,
        fontSize: 14,
        color: '#6B7280',
    },
})
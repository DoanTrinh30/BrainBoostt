import React from 'react'
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import StatItem from '../../components/containers/StatItem'
import { BarChart } from 'react-native-gifted-charts'
import InviteFriends from '../../components/footer/InviteFriends'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../services/profileService'
import { getAllDecks } from '../../services/deckService'
import { getTotalFolders } from '../../services/folderService'
import { getTotalFlashcards } from '../../services/flashcardService'
import { Ionicons } from '@expo/vector-icons'
import {
    getReviewStats,
    getWeeklyActivity,
    getAIInsights,
} from '../../services/reviewLogService'

export default function ProfileScreen() {
    const router = useRouter()

    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getProfile,
    })

    const { data: decksData, isLoading: isDecksLoading } = useQuery({
        queryKey: ['decks'],
        queryFn: getAllDecks,
    })

    const { data: totalFolderData, isLoading: isTotalFolderLoading } = useQuery({
        queryKey: ['totalfolders'],
        queryFn: getTotalFolders,
    })

    const { data: totalFlashcardData, isLoading: isTotalFlashcardLoading } =
        useQuery({
            queryKey: ['totalflashcards'],
            queryFn: getTotalFlashcards,
        })

    const { data: reviewStats } = useQuery({
        queryKey: ['reviewStats'],
        queryFn: getReviewStats,
        staleTime: 30 * 1000,
    })

    const { data: weeklyData, isLoading: isWeeklyLoading } = useQuery({
        queryKey: ['weeklyActivity'],
        queryFn: getWeeklyActivity,
        staleTime: 30 * 1000,
    })

    const { data: insights, isLoading: isInsightsLoading } = useQuery({
        queryKey: ['aiInsights'],
        queryFn: getAIInsights,
        staleTime: 30 * 1000,
    })

    const isLoading =
        isUserLoading ||
        isDecksLoading ||
        isTotalFolderLoading ||
        isTotalFlashcardLoading

    const deckCount = decksData?.decks?.length || 0
    const folderCount = totalFolderData?.folderCount || 0
    const flashcardCount = totalFlashcardData?.flashcardCount || 0

    const totalReviews = reviewStats?.totalReviews || 0
    const correctReviews = reviewStats?.correctReviews || 0
    const accuracy = reviewStats?.accuracy || 0
    const avgResponseTime = reviewStats?.avgResponseTime || 0

    const totalTimeMs = avgResponseTime * totalReviews
    const totalMinutes = Math.floor(totalTimeMs / 60000)
    const totalSeconds = Math.floor((totalTimeMs % 60000) / 1000)
    const timeSpentStr =
        totalMinutes > 0
            ? `${totalMinutes}m ${totalSeconds}s`
            : `${totalSeconds}s`

    const barData = Array.isArray(weeklyData)
        ? weeklyData.map((day, index) => ({
              value: day.count,
              label: day.dayLabel,
              frontColor:
                  day.count > 0
                      ? index === weeklyData.length - 1
                          ? '#3D5CFF'
                          : '#8FA5FF'
                      : '#E0E0E0',
          }))
        : []

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </SafeAreaView>
        )
    }

    if (isUserError) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>
                        Lỗi:{' '}
                        {userError?.message ||
                            'Không thể tải dữ liệu. Vui lòng thử lại.'}
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text>Chưa có dữ liệu người dùng</Text>
                </View>
            </SafeAreaView>
        )
    }

    // Avatar fallback
    const avatarUri =
        user.avatar_url ||
        'https://ui-avatars.com/api/?name=' +
            encodeURIComponent(user.username || user.email || 'User') +
            '&background=3D5CFF&color=fff&size=200'

    const displayName =
        user.username || user.email?.split('@')[0] || 'Người dùng'

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hồ sơ</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/user/setting')}
                    >
                        <Ionicons name="settings" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.userInfoContainer}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: avatarUri }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userRole}>{user.email}</Text>
                </View>

                {/* ===== AI INSIGHTS ===== */}
                {!isInsightsLoading && insights && totalReviews > 0 && (
                    <View style={styles.aiInsightsContainer}>
                        <View style={styles.aiBadge}>
                            <Ionicons
                                name="sparkles"
                                size={14}
                                color="#3D5CFF"
                            />
                            <Text style={styles.aiBadgeText}>Phân tích AI</Text>
                        </View>

                        <View style={styles.insightRow}>
                            <View style={styles.insightItem}>
                                <Text style={styles.insightValue}>
                                    🔥 {insights.currentStreak}
                                </Text>
                                <Text style={styles.insightLabel}>
                                    ngày liên tiếp
                                </Text>
                            </View>
                            <View style={styles.insightDivider} />
                            <View style={styles.insightItem}>
                                <Text style={styles.insightValue}>
                                    📊{' '}
                                    {Math.round(insights.avgRetention * 100)}%
                                </Text>
                                <Text style={styles.insightLabel}>
                                    tỷ lệ nhớ trung bình
                                </Text>
                            </View>
                        </View>

                        {insights.bestTimeOfDay && (
                            <View style={styles.bestTimeBox}>
                                <Text style={styles.bestTimeLabel}>
                                    ⏰ Bạn học hiệu quả nhất vào:
                                </Text>
                                <Text style={styles.bestTimeValue}>
                                    {insights.bestTimeOfDay.label} (
                                    {insights.bestTimeOfDay.hour}:00) - độ chính
                                    xác{' '}
                                    {Math.round(
                                        insights.bestTimeOfDay.accuracy * 100
                                    )}
                                    %
                                </Text>
                            </View>
                        )}

                        <View style={styles.modelInfoBox}>
                            <Ionicons
                                name="hardware-chip-outline"
                                size={14}
                                color="#666"
                            />
                            <Text style={styles.modelInfoText}>
                                Powered by Gradient Boosting (Duolingo 1.5M
                                samples)
                            </Text>
                        </View>
                    </View>
                )}

                {/* Activity Section */}
                <View style={styles.activityContainer}>
                    <View style={styles.activityHeaderContainer}>
                        <Text style={styles.sectionTitle}>Hoạt động</Text>
                        <TouchableOpacity style={styles.dropdown}>
                            <Text style={styles.dropdownText}>Tuần</Text>
                            <Icon name="chevron-down" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hoursContainer}>
                        <Text style={styles.hoursText}>{timeSpentStr}</Text>
                        <Text style={styles.hoursLabel}>
                            Thời gian học ({totalReviews} lượt ôn)
                        </Text>
                    </View>

                    <View style={styles.chartContainer}>
                        {isWeeklyLoading ? (
                            <ActivityIndicator
                                size="small"
                                color="#3D5CFF"
                                style={{ marginVertical: 50 }}
                            />
                        ) : barData.length > 0 ? (
                            <BarChart
                                barWidth={18}
                                noOfSections={4}
                                barBorderRadius={6}
                                frontColor="#8FA5FF"
                                yAxisThickness={0}
                                xAxisThickness={0}
                                spacing={20}
                                isAnimated
                                data={barData}
                            />
                        ) : (
                            <Text style={styles.noDataText}>
                                Chưa có dữ liệu học tuần này
                            </Text>
                        )}
                    </View>
                </View>

                {/* ML STATS */}
                {totalReviews > 0 && (
                    <View style={styles.mlStatsContainer}>
                        <Text style={styles.sectionTitle}>
                            Thống kê học tập (AI)
                        </Text>
                        <View style={styles.mlStatsRow}>
                            <View style={styles.mlStatCard}>
                                <Text style={styles.mlStatNumber}>
                                    {totalReviews}
                                </Text>
                                <Text style={styles.mlStatLabel}>
                                    Tổng lượt ôn
                                </Text>
                            </View>
                            <View style={styles.mlStatCard}>
                                <Text
                                    style={[
                                        styles.mlStatNumber,
                                        { color: '#33D9A6' },
                                    ]}
                                >
                                    {Math.round(accuracy * 100)}%
                                </Text>
                                <Text style={styles.mlStatLabel}>
                                    Độ chính xác
                                </Text>
                                <Text style={styles.mlStatSubLabel}>
                                    ({correctReviews}/{totalReviews})
                                </Text>
                            </View>
                            <View style={styles.mlStatCard}>
                                <Text
                                    style={[
                                        styles.mlStatNumber,
                                        { color: '#FF9500' },
                                    ]}
                                >
                                    {(avgResponseTime / 1000).toFixed(1)}s
                                </Text>
                                <Text style={styles.mlStatLabel}>
                                    Thời gian TB
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Progress Statistics */}
                <View style={styles.progressContainer}>
                    <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
                    <View style={styles.courseStatsContainer}>
                        <StatItem
                            iconName="folder"
                            iconColor="#34C759"
                            number={folderCount}
                            label="Thư mục"
                        />
                        <StatItem
                            iconName="credit-card"
                            iconColor="#007AFF"
                            number={deckCount}
                            label="Bộ thẻ"
                        />
                        <StatItem
                            iconName="documents"
                            iconColor="#FF9500"
                            number={flashcardCount}
                            label="Thẻ học"
                        />
                    </View>
                </View>

                <InviteFriends />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    errorText: { color: 'red', textAlign: 'center', margin: 20 },
    userInfoContainer: { alignItems: 'center', paddingVertical: 20 },
    avatarContainer: { position: 'relative', width: 100, height: 100 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        borderWidth: 3,
        borderColor: '#febc82',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#09a1fe',
    },
    userRole: { fontSize: 16, color: '#A0A0A0', marginTop: 5 },
    aiInsightsContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 18,
        backgroundColor: '#F0F4FF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D4DEFF',
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    aiBadgeText: {
        color: '#3D5CFF',
        fontSize: 11,
        fontWeight: '700',
        marginLeft: 4,
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    insightItem: { flex: 1, alignItems: 'center' },
    insightDivider: { width: 1, height: 36, backgroundColor: '#D4DEFF' },
    insightValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1F36',
        marginBottom: 4,
    },
    insightLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
    bestTimeBox: {
        marginTop: 14,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
    },
    bestTimeLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    bestTimeValue: { fontSize: 14, fontWeight: '600', color: '#1A1F36' },
    modelInfoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#D4DEFF',
    },
    modelInfoText: {
        marginLeft: 6,
        fontSize: 11,
        color: '#666',
        fontStyle: 'italic',
    },
    activityContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingBottom: 15,
    },
    activityHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15,
    },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    dropdownText: { color: '#fff', fontSize: 14, marginRight: 10 },
    hoursContainer: { alignItems: 'center', marginTop: 5 },
    hoursText: { fontSize: 28, fontWeight: 'bold', color: '#002357' },
    hoursLabel: { fontSize: 14, paddingHorizontal: 16, color: '#002357' },
    chartContainer: { marginTop: 10, padding: 5, alignItems: 'center' },
    noDataText: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginVertical: 30,
        fontSize: 13,
    },
    mlStatsContainer: {
        marginHorizontal: 20,
        marginTop: 30,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    mlStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    mlStatCard: { alignItems: 'center', flex: 1 },
    mlStatNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3D5CFF',
        marginBottom: 4,
    },
    mlStatLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
    mlStatSubLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
    progressContainer: {
        marginHorizontal: 20,
        marginTop: 30,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    courseStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingVertical: 5,
    },
})
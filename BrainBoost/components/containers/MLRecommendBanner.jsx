import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

/**
 * Banner hiển thị flashcards mà ML gợi ý cần ôn.
 * 
 * Props:
 *   recommendations: array - từ API /api/review-logs/recommend
 *   isLoading: boolean
 *   onPress: function - khi user bấm "Ôn ngay"
 */
const MLRecommendBanner = ({ recommendations, isLoading, onPress }) => {
    // Loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3D5CFF" />
                <Text style={styles.loadingText}>
                    AI đang phân tích tiến độ học của bạn...
                </Text>
            </View>
        )
    }

    // Không có gì để ôn
    if (!recommendations || recommendations.length === 0) {
        return null
    }

    // Tính xác suất quên trung bình (1 - retention)
    const avgForgetProbability =
        recommendations.reduce(
            (sum, r) => sum + (1 - r.retentionProbability),
            0
        ) / recommendations.length

    const forgetPercent = Math.round(avgForgetProbability * 100)

    // Lấy card khẩn cấp nhất (xác suất nhớ thấp nhất)
    const urgentCard = recommendations[0]

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <LinearGradient
                colors={['#3D5CFF', '#5B7FFF', '#8FA5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Badge "AI" */}
                <View style={styles.badge}>
                    <Ionicons name="sparkles" size={12} color="#FFF" />
                    <Text style={styles.badgeText}>AI gợi ý</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>
                        🧠 Bạn có {recommendations.length} từ vựng sắp quên
                    </Text>
                    <Text style={styles.subtitle}>
                        AI dự đoán: {forgetPercent}% khả năng quên nếu không ôn
                        sớm
                    </Text>

                    {/* Card khẩn cấp nhất */}
                    {urgentCard?.flashcard?.frontText && (
                        <View style={styles.urgentBox}>
                            <Text style={styles.urgentLabel}>
                                Cần ôn nhất:
                            </Text>
                            <Text style={styles.urgentCard}>
                                "{urgentCard.flashcard.frontText}"
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action button */}
                <View style={styles.actionRow}>
                    <Text style={styles.actionText}>Ôn ngay</Text>
                    <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="#FFF"
                        style={{ marginLeft: 6 }}
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginVertical: 12,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#3D5CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    gradient: {
        padding: 18,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
        marginLeft: 4,
        letterSpacing: 0.3,
    },
    content: {
        marginBottom: 12,
    },
    title: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        lineHeight: 18,
    },
    urgentBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: 10,
        padding: 10,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    urgentLabel: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 6,
    },
    urgentCard: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        fontStyle: 'italic',
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    actionText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginVertical: 12,
        padding: 14,
        backgroundColor: '#F0F4FF',
        borderRadius: 12,
    },
    loadingText: {
        marginLeft: 10,
        color: '#3D5CFF',
        fontSize: 13,
        fontWeight: '500',
    },
})

export default MLRecommendBanner
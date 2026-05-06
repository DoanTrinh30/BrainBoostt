import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

/**
 * Displays the user's last score or a message when no score exists
 */
const ScoreCard = ({ lastScore, isLoading, formatDate }) => {
    return (
        <View style={styles.scoreCard}>
            {isLoading ? (
                <Text style={styles.loadingText}>Loading score data...</Text>
            ) : lastScore ? (
                <>
                    <Text style={styles.lastScoreLabel}>Your last score</Text>
                    <Text style={styles.scoreValue}>{lastScore.score}%</Text>
                    <Text style={styles.scoreDate}>
                        {formatDate
                            ? formatDate(lastScore.timestamp)
                            : lastScore.timestamp}
                    </Text>
                </>
            ) : (
                <>
                    <Text style={styles.noScoreTitle}>No previous tests</Text>
                    <Text style={styles.noScoreText}>
                        Take your first test to track your progress
                    </Text>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    scoreCard: {
        backgroundColor: '#EFF5FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#3D5CFF',
    },
    lastScoreLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3D5CFF',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3D5CFF',
    },
    scoreDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    noScoreTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3D5CFF',
        marginBottom: 8,
    },
    noScoreText: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#3D5CFF',
    },
})

export default ScoreCard

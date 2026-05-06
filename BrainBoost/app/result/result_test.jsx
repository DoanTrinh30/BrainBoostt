import React, { useEffect } from 'react'
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Svg, Circle } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import SubmitButton from '../../components/buttons/SubmitButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CIRCLE_CONFIG = {
    SIZE: 120,
    STROKE: 10,
}

const ResultTestScreen = () => {
    const router = useRouter()
    const { deckId, correctCount, total, incorrectAnswers } =
        useLocalSearchParams()

    const correct = parseInt(correctCount, 10)
    const totalQuestions = parseInt(total, 10)
    const incorrectCount = totalQuestions - correct
    const incorrectList = incorrectAnswers ? JSON.parse(incorrectAnswers) : []
    const percentage = Math.round((correct / totalQuestions) * 100)

    const { SIZE, STROKE } = CIRCLE_CONFIG
    const radius = (SIZE - STROKE) / 2
    const circumference = 2 * Math.PI * radius
    const strokeOffset = circumference - (percentage / 100) * circumference

    const navigateToDeck = () =>
        router.push(deckId ? `/decks/deckdetail?id=${deckId}` : '/(tabs)')
    const retakeTest = () => router.replace(`/learning/test?deckId=${deckId}`)

    // Save the score to AsyncStorage when component mounts
    useEffect(() => {
        const saveScore = async () => {
            try {
                const scoreData = {
                    score: percentage,
                    timestamp: new Date().toISOString(),
                    correctCount: correct,
                    totalQuestions,
                }

                await AsyncStorage.setItem(
                    `lastScore_${deckId}`,
                    JSON.stringify(scoreData),
                )
            } catch (error) {
                console.log('Error saving score:', error)
            }
        }

        if (deckId) {
            saveScore()
        }
    }, [percentage, correct, totalQuestions, deckId])

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                correct={correct}
                totalQuestions={totalQuestions}
                onClose={navigateToDeck}
            />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>You're making progress!</Text>
                <Text style={styles.subtitle}>Your results</Text>

                <ProgressCircle
                    size={SIZE}
                    stroke={STROKE}
                    radius={radius}
                    circumference={circumference}
                    strokeOffset={strokeOffset}
                    percentage={percentage}
                />

                <ResultBadges
                    correct={correct}
                    incorrectCount={incorrectCount}
                />
                <NextSteps onRetake={retakeTest} />

                {incorrectList.length > 0 && (
                    <IncorrectAnswersList incorrectList={incorrectList} />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const Header = ({ correct, totalQuestions, onClose }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.fraction}>{`${correct}/${totalQuestions}`}</Text>
        <View style={{ width: 24 }} />
    </View>
)

const ProgressCircle = ({
    size,
    stroke,
    radius,
    circumference,
    strokeOffset,
    percentage,
}) => (
    <View style={styles.chartWrap}>
        <Svg width={size} height={size}>
            <Circle
                fill="#FFF"
                stroke="#EEE"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={stroke}
            />
            <Circle
                fill="none"
                stroke="#3D5CFF"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${size / 2}, ${size / 2}`}
            />
        </Svg>
        <View style={styles.chartCenter}>
            <Text style={styles.percentText}>{`${percentage}%`}</Text>
        </View>
    </View>
)

const ResultBadges = ({ correct, incorrectCount }) => (
    <View style={styles.resultRow}>
        <View style={styles.resultItem}>
            <Text style={styles.correctLabel}>Correct</Text>
            <View style={styles.badgeCorrect}>
                <Text style={styles.badgeText}>{correct}</Text>
            </View>
        </View>
        <View style={styles.resultItem}>
            <Text style={styles.incorrectLabel}>Incorrect</Text>
            <View style={styles.badgeIncorrect}>
                <Text style={styles.badgeText}>{incorrectCount}</Text>
            </View>
        </View>
    </View>
)

const NextSteps = ({ onRetake }) => (
    <>
        <Text style={styles.nextSteps}>Next steps</Text>
        <SubmitButton
            text="Take a new test"
            onPress={onRetake}
            style={styles.retakeButton}
        />
    </>
)

const IncorrectAnswersList = ({ incorrectList }) => (
    <View style={styles.incorrectSection}>
        <Text style={styles.sectionHeader}>Incorrect answers</Text>
        {incorrectList.map((item, index) => (
            <View key={index} style={styles.card}>
                <View style={styles.cardContent}>
                    <Text style={styles.questionText}>
                        Q{index + 1}: {item.question}
                    </Text>
                    <Text style={styles.definition}>
                        Correct answer:{' '}
                        <Text style={styles.correctAns}>
                            {item.correctAnswer}
                        </Text>
                    </Text>
                </View>
                <View style={styles.cardFooterIncorrect}>
                    <Ionicons name="close-circle" size={16} color="#FF5252" />
                </View>
            </View>
        ))}
    </View>
)

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    fraction: { fontSize: 16, fontWeight: '600', color: '#333' },
    content: { padding: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
    chartWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartCenter: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentText: { fontSize: 18, fontWeight: '700', color: '#000' },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    resultItem: { alignItems: 'center' },
    correctLabel: { fontSize: 14, color: '#4CAF50', marginBottom: 4 },
    incorrectLabel: { fontSize: 14, color: '#FF5252', marginBottom: 4 },
    badgeCorrect: {
        backgroundColor: '#E6FFF0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeIncorrect: {
        backgroundColor: '#FFE6E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: { fontSize: 14, fontWeight: '600', color: '#333' },
    nextSteps: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 12,
    },
    retakeButton: { width: '100%', paddingVertical: 14 },
    incorrectSection: { width: '100%', marginTop: 20 },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    cardContent: { padding: 12, backgroundColor: '#FFF' },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    definition: { fontSize: 14, color: '#555' },
    correctAns: { fontWeight: '600', color: '#4CAF50' },
    cardFooterIncorrect: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE6E6',
        padding: 8,
    },
    incorrectText: { color: '#FF5252', fontWeight: '600', marginLeft: 4 },
})

export default ResultTestScreen

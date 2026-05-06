import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import SubmitButton from '../../components/buttons/SubmitButton'
import { SafeAreaView } from 'react-native-safe-area-context'

const shuffleArray = (array) => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

const ResultLearnScreen = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    const correctCount = parseInt(params.correctCount || '0', 10)
    const total = parseInt(params.total || '0', 10)
    const flashcards = params.flashcards || '[]'
    const deckId = params.deckId || ''

    const passedThreshold = correctCount >= Math.ceil(total / 2)
    const percentageCorrect = Math.round((correctCount / total) * 100)

    const handlePracticeMore = () => {
        let parsed = []
        try {
            parsed = JSON.parse(flashcards || '[]')
        } catch (err) {
            console.warn('Invalid flashcards JSON', err)
        }

        const shuffledData = parsed.map((item) => {
            if (!item || !item.options || !Array.isArray(item.options)) {
                return item
            }

            return {
                ...item,
                options: shuffleArray([...item.options]),
            }
        })

        router.push({
            pathname: '/learning/learn',
            params: {
                flashcards: flashcards,
                data: JSON.stringify(shuffledData),
                deckName: params.deckName,
                deckId: deckId,
            },
        })
    }

    const handleTakeTest = () => {
        router.push({
            pathname: '/learning/setuptest',
            params: {
                deckId: deckId,
                deckName: params.deckName,
                flashcards: flashcards,
            },
        })
    }

    const navigateToDeckDetails = () => {
        if (deckId) {
            router.push(`/decks/deckdetail?id=${deckId}`)
        } else {
            router.back()
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={navigateToDeckDetails}
            >
                <Ionicons name="close" size={28} color="#555" />
            </TouchableOpacity>

            {passedThreshold ? (
                <>
                    <View style={styles.trophyBox}>
                        <Ionicons name="trophy" size={64} color="#FFB800" />
                    </View>

                    <Text style={styles.scoreText}>
                        You got {correctCount}/{total} correct!
                    </Text>

                    <Text style={styles.title}>
                        Way to go! You've studied all the terms.
                    </Text>
                    <Text style={styles.description}>
                        Try another round so you can get more practice with the
                        tough ones.
                    </Text>
                </>
            ) : (
                <>
                    <View style={styles.improvementBox}>
                        <Ionicons name="book" size={64} color="#3D5CFF" />
                    </View>

                    <Text style={styles.scoreText}>
                        You got {correctCount}/{total} correct (
                        {percentageCorrect}%)
                    </Text>

                    <Text style={styles.improvementTitle}>
                        Keep going! You're making progress.
                    </Text>
                    <Text style={styles.improvementDescription}>
                        It takes practice to master these concepts. Let's
                        continue learning and try again.
                    </Text>
                </>
            )}

            <SubmitButton
                onPress={handlePracticeMore}
                text={passedThreshold ? 'Practice more' : 'Try again'}
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
                icon={
                    passedThreshold ? null : (
                        <Ionicons
                            name="refresh"
                            size={18}
                            color="#FFF"
                            style={{ marginRight: 8 }}
                        />
                    )
                }
            />

            <SubmitButton
                onPress={handleTakeTest}
                text="Take a test"
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
            />
        </SafeAreaView>
    )
}

export default ResultLearnScreen

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    trophyBox: {
        marginTop: 60,
        marginBottom: 12,
        backgroundColor: '#FFF4D4',
        borderRadius: 100,
        padding: 30,
    },
    improvementBox: {
        marginTop: 60,
        marginBottom: 12,
        backgroundColor: '#EBF3FF',
        borderRadius: 100,
        padding: 30,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    // Success styles
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    // Improvement styles
    improvementTitle: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        color: '#3D5CFF',
        marginBottom: 12,
    },
    improvementDescription: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    // Button styles
    primaryButton: {
        width: '100%',
        backgroundColor: '#3D5CFF',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 14,
        marginTop: 250,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: '#F5F6FA',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
})

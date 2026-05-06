import React, { useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

const { width, height } = Dimensions.get('window')

const Confetti = ({ show }) => {
    const confettiAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (show) {
            Animated.timing(confettiAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }).start()
        }
    }, [show])

    if (!show) return null

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {[...Array(10)].map((_, i) => (
                <Animated.View
                    key={i}
                    style={{
                        position: 'absolute',
                        left: (width / 10) * i + 10,
                        top: 0,
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: `hsl(${i * 36}, 80%, 60%)`,
                        opacity: confettiAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                        transform: [
                            {
                                translateY: confettiAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, height * 0.5],
                                }),
                            },
                            {
                                rotate: confettiAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', `${i * 36}deg`],
                                }),
                            },
                        ],
                    }}
                />
            ))}
        </View>
    )
}

const FlashcardResultScreen = () => {
    const router = useRouter()
    const { correctCount, total, deckName, deckId } = useLocalSearchParams()
    const { flashcards } = useSelector((state) => state.flashcards)

    const isPerfect = correctCount === total && total > 0
    const isMoreThanHalf = correctCount >= Math.ceil(total / 2) && !isPerfect

    let title = ''
    let subtitle = ''
    let icon = ''
    let iconColor = ''

    if (isPerfect) {
        title = 'Congratulations!'
        subtitle = 'You remembered all the flashcards!'
        icon = 'trophy-outline'
        iconColor = '#FFD700'
    } else if (isMoreThanHalf) {
        title = 'Great job!'
        subtitle = 'You remembered more than half! Keep it up.'
        icon = 'happy-outline'
        iconColor = '#33D9A6'
    } else {
        title = 'Keep going!'
        subtitle = "You're making progress. Practice makes perfect!"
        icon = 'rocket-outline'
        iconColor = '#3D5CFF'
    }

    const handleTryAgain = () => {
        router.push({
            pathname: '/learning/flashcard',
            params: {
                flashcards,
                deckName,
                deckId,
            },
        })
    }

    const handleBackToDeck = () => {
        if (deckId) {
            router.push(`/decks/deckdetail?id=${deckId}`)
        } else {
            router.back()
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Confetti show={isPerfect} />
                <View style={styles.iconBox}>
                    <Ionicons name={icon} size={64} color={iconColor} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.scoreText}>
                    <Text style={styles.scoreNumber}>{correctCount}</Text>
                    <Text style={styles.scoreTotal}> / {total} remembered</Text>
                </Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.tryAgainButton}
                        onPress={handleTryAgain}
                    >
                        <Ionicons
                            name="refresh"
                            size={20}
                            color="#fff"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.tryAgainText}>Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToDeck}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#3D5CFF"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.backText}>Back to Deck</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#F8F9FD',
    },
    iconBox: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#222',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    scoreText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 32,
        textAlign: 'center',
    },
    scoreNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#3D5CFF',
    },
    scoreTotal: {
        fontSize: 20,
        color: '#888',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        gap: 16,
    },
    tryAgainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3D5CFF',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 16,
        marginRight: 8,
        shadowColor: '#3D5CFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    tryAgainText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#3D5CFF',
        marginLeft: 8,
    },
    backText: {
        color: '#3D5CFF',
        fontWeight: '700',
        fontSize: 16,
    },
})

export default FlashcardResultScreen

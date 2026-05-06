import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FlashcardFlipCarousel } from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import {
    setFlashcards,
    clearFlashcards,
} from '../../redux/slices/flashcardSlice'
const { width, height } = Dimensions.get('window')

const FlashcardScreen = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const {
        flashcards: flashcardsString,
        deckName,
        deckId,
    } = useLocalSearchParams()

    const [flashcardsLearned, setFlashcardsLearned] = useState({
        knew: {
            quantity: 0,
            flashcards: [],
        },
        didntKnow: {
            quantity: 0,
            flashcards: [],
        },
    })
    const [swipeCount, setSwipeCount] = useState(0)

    let flashcards = []
    try {
        flashcards = JSON.parse(flashcardsString || '[]')
    } catch (e) {
        console.error('Failed to parse flashcards data:', e)
    }

    const handleSwipe = (flashcard, direction) => {
        setSwipeCount((prev) => prev + 1)
        if (direction === 'right') {
            setFlashcardsLearned((prev) => ({
                ...prev,
                knew: {
                    quantity: prev.knew.quantity + 1,
                    flashcards: [...prev.knew.flashcards, flashcard],
                },
            }))
        } else if (direction === 'left') {
            setFlashcardsLearned((prev) => ({
                ...prev,
                didntKnow: {
                    quantity: prev.didntKnow.quantity + 1,
                    flashcards: [...prev.didntKnow.flashcards, flashcard],
                },
            }))
        }
    }

    const handleSwipedAll = () => {
        router.push({
            pathname: '/result/result_flashcard',
            params: {
                correctCount: flashcardsLearned.knew.quantity,
                total: flashcards.length,
                flashcards: JSON.stringify(flashcards),
                deckName: deckName || '',
                deckId: deckId || '',
            },
        })
    }

    useEffect(() => {
        if (swipeCount === flashcards.length && flashcards.length > 0) {
            handleSwipedAll()
        }
    }, [swipeCount, flashcardsLearned, flashcards.length])

    useEffect(() => {
        if (flashcardsString) {
            dispatch(setFlashcards(flashcardsString))
        }
        return () => {
            dispatch(clearFlashcards())
        }
    }, [flashcardsString])

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {/* Header with Back Button and Title */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{deckName || 'Flashcards'}</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Status Bar */}
                <View style={styles.statusBar}>
                    <View
                        style={[
                            styles.counterBox,
                            {
                                backgroundColor: '#FFEFE6',
                                borderColor: '#FFA500',
                            },
                        ]}
                    >
                        <Text
                            style={[styles.counterText, { color: '#FFA500' }]}
                        >
                            {flashcardsLearned.didntKnow.quantity}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.counterBox,
                            {
                                backgroundColor: '#E6FFF2',
                                borderColor: '#33D9A6',
                            },
                        ]}
                    >
                        <Text
                            style={[styles.counterText, { color: '#33D9A6' }]}
                        >
                            {flashcardsLearned.knew.quantity}
                        </Text>
                    </View>
                </View>

                {/* Flashcard Component */}
                {flashcards.length > 0 ? (
                    <View style={styles.carouselContainer}>
                        <FlashcardFlipCarousel
                            data={flashcards}
                            showIcon={false}
                            cardWidth={width * 0.85}
                            cardHeight={height * 0.6}
                            mode="stack"
                            onSwipe={handleSwipe}
                            onSwipedAll={handleSwipedAll}
                        />
                    </View>
                ) : (
                    <Text style={styles.noCardsText}>
                        No flashcards available for this deck.
                    </Text>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    backButton: {
        marginRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    carouselContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noCardsText: {
        flex: 1,
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 8,
        marginHorizontal: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    counterBox: {
        width: 50,
        height: 35,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterText: {
        fontSize: 14,
        fontWeight: '700',
    },
})

export default FlashcardScreen

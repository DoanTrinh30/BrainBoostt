import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import SubmitButton from '../../components/buttons/SubmitButton'
import QuestionHeader from '../../components/containers/QuestionHeader'
import AnswerOption from '../../components/containers/AnswerOption'
import ProgressBar from '../../components/containers/ProgressBar'
import { SafeAreaView } from 'react-native-safe-area-context'

const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

const LearnScreen = () => {
    const router = useRouter()
    const { flashcards, deckName, deckId, data } = useLocalSearchParams()
    const fadeAnim = useRef(new Animated.Value(0)).current

    const [processedData, setProcessedData] = useState([])
    const [state, setState] = useState({
        currentIndex: 0,
        selectedOption: null,
        isAnswered: false,
        showHint: false,
        correctCount: 0,
    })

    useEffect(() => {
        if (flashcards && data) {
            try {
                const parsedFlashcards = JSON.parse(flashcards)
                const parsedData = JSON.parse(data)

                // Process and combine flashcards with distractors
                const combinedData = parsedData.map((item, index) => {
                    // Create an array with correct answer and distractors
                    const options = shuffleArray(
                        item.options
                            ? [...item.options]
                            : [...item.distractors, item.answer],
                    )

                    return {
                        question: item.question,
                        options,
                        correctAnswer: item.answer,
                    }
                })

                setProcessedData(combinedData)

                // Reset state
                setState({
                    currentIndex: 0,
                    selectedOption: null,
                    isAnswered: false,
                    showHint: false,
                    correctCount: 0,
                })
                fadeAnim.setValue(0)
            } catch (error) {
                console.error('Failed to parse data:', error)
            }
        }
    }, [flashcards, data])

    if (processedData.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Learn</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={[styles.centerContent]}>
                    <Text style={styles.noCardsText}>
                        Loading flashcards...
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    const currentCard = processedData[state.currentIndex]
    const isFinished =
        state.currentIndex === processedData.length - 1 && state.isAnswered

    const handleOptionPress = (option) => {
        if (!state.isAnswered) {
            setState((prev) => ({
                ...prev,
                selectedOption: option,
                isAnswered: true,
                correctCount:
                    option === currentCard.correctAnswer
                        ? prev.correctCount + 1
                        : prev.correctCount,
            }))
        }
    }

    const handleNext = () => {
        if (state.currentIndex < processedData.length - 1) {
            setState((prev) => ({
                ...prev,
                currentIndex: prev.currentIndex + 1,
                selectedOption: null,
                isAnswered: false,
                showHint: false,
            }))
            fadeAnim.setValue(0)
        }
    }

    const handleShowHint = () => {
        if (state.showHint) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setState((prev) => ({ ...prev, showHint: false }))
            })
        } else {
            setState((prev) => ({ ...prev, showHint: true }))
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    }

    const handleFinish = () => {
        router.push({
            pathname: '/result/resultlearn',
            params: {
                correctCount: state.correctCount,
                total: processedData.length,
                flashcards: JSON.stringify(processedData),
                deckName,
                deckId,
            },
        })
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{deckName || 'Learn'}</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Progress */}
            <ProgressBar
                current={state.currentIndex + 1}
                total={processedData.length}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Question + Hint */}
                <View style={styles.questionRow}>
                    <QuestionHeader question={currentCard.question} />
                    <TouchableOpacity onPress={handleShowHint}>
                        <Ionicons name="bulb" size={26} color="#3D5CFF" />
                    </TouchableOpacity>
                </View>

                {/* Hint Box */}
                {state.showHint && (
                    <Animated.View
                        style={[styles.hintBox, { opacity: fadeAnim }]}
                    >
                        <Text style={styles.hintText}>
                            Hint: {currentCard.correctAnswer}
                        </Text>
                    </Animated.View>
                )}

                {/* Answer Options */}
                {currentCard.options.map((option, index) => (
                    <AnswerOption
                        key={index}
                        option={option}
                        onPress={() => handleOptionPress(option)}
                        isCorrect={
                            state.isAnswered &&
                            option === currentCard.correctAnswer
                        }
                        isIncorrect={
                            state.isAnswered &&
                            option === state.selectedOption &&
                            option !== currentCard.correctAnswer
                        }
                        isSelected={option === state.selectedOption}
                        disabled={state.isAnswered}
                    />
                ))}

                {/* Next or Finish Button */}
                {state.isAnswered && (
                    <SubmitButton
                        onPress={isFinished ? handleFinish : handleNext}
                        text={isFinished ? 'Finish' : 'Next'}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default LearnScreen

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    content: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    hintBox: {
        backgroundColor: '#F0F5FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        marginTop: -10,
        borderLeftWidth: 4,
        borderLeftColor: '#3D5CFF',
    },
    hintText: {
        color: '#333',
        fontSize: 15,
    },
    noCardsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
})

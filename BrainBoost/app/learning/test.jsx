import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import ProgressBar from '../../components/containers/ProgressBar'
import AnswerOption from '../../components/containers/AnswerOption'
import SubmitButton from '../../components/buttons/SubmitButton'
import { generateTestQuestions } from '../../helpers/testUtils'

export default function TestScreen() {
    const router = useRouter()
    const {
        deckId,
        flashcards,
        deckName,
        questionCount = '10',
        instantFeedback = 'true',
        includeTrueFalse = 'true',
        includeMultipleChoice = 'true',
        includeWritten = 'false',
    } = useLocalSearchParams()

    const parsedFlashcards = flashcards ? JSON.parse(flashcards) : []

    // Convert string params to boolean/number
    const showInstantFeedback = instantFeedback === 'true'
    const validQuestionCount = Math.max(1, parseInt(questionCount, 10) || 1)
    const includeTrue = includeTrueFalse === 'true'
    const includeMulti = includeMultipleChoice === 'true'
    const includeWrite = includeWritten === 'true'

    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [responses, setResponses] = useState([])
    const [writtenAnswer, setWrittenAnswer] = useState('')
    const [showWrittenFeedback, setShowWrittenFeedback] = useState(false)

    // Generate test questions based on configuration
    useEffect(() => {
        if (parsedFlashcards.length > 0 && questions.length === 0) {
            const generatedQuestions = generateTestQuestions(
                parsedFlashcards,
                validQuestionCount,
                includeTrue,
                includeMulti,
                includeWrite,
            )

            setQuestions(generatedQuestions)
        }
    }, [
        parsedFlashcards,
        validQuestionCount,
        includeTrue,
        includeMulti,
        includeWrite,
        questions.length,
    ])

    const totalQuestions = questions.length
    const currentQuestion = questions[currentIndex] || {
        question: 'Loading...',
        options: [],
    }
    const isLast = currentIndex === totalQuestions - 1

    const handleClose = () => router.back()

    const handleSkip = () => {
        setResponses((prev) => [...prev, null])
        if (!isLast) {
            setCurrentIndex((prev) => prev + 1)
            setSelectedOption(null)
            setWrittenAnswer('')
            setShowWrittenFeedback(false)
        } else {
            finishTest([...responses, null])
        }
    }

    const handleAnswer = (option) => {
        if (selectedOption === null) {
            setSelectedOption(option)

            if (!showInstantFeedback && !isLast) {
                setTimeout(() => {
                    setResponses((prev) => [...prev, option])
                    setCurrentIndex((prev) => prev + 1)
                    setSelectedOption(null)
                    setWrittenAnswer('')
                    setShowWrittenFeedback(false)
                }, 300)
            }
        }
    }

    const handleCheckWrittenAnswer = () => {
        setShowWrittenFeedback(true)
        const isCorrect =
            writtenAnswer.trim().toLowerCase() ===
            currentQuestion.correctAnswer.trim().toLowerCase()
        setSelectedOption(
            isCorrect ? currentQuestion.correctAnswer : writtenAnswer,
        )
    }

    const handleNextOrFinish = () => {
        const allResponses = [...responses, selectedOption]
        if (!isLast) {
            setResponses(allResponses)
            setCurrentIndex((prev) => prev + 1)
            setSelectedOption(null)
            setWrittenAnswer('')
            setShowWrittenFeedback(false)
        } else {
            finishTest(allResponses)
        }
    }

    const finishTest = (allResponses) => {
        // Calculate results
        const correctCount = questions.reduce((count, question, idx) => {
            const response = allResponses[idx]

            if (question.type === 'trueFalse') {
                const isCorrect = response === question.correctAnswer
                return count + (isCorrect ? 1 : 0)
            } else if (question.type === 'written') {
                const isCorrect = response === question.correctAnswer
                return count + (isCorrect ? 1 : 0)
            } else {
                const isCorrect = response === question.correctAnswer
                return count + (isCorrect ? 1 : 0)
            }
        }, 0)

        const wrongList = questions.filter((question, idx) => {
            if (question.type === 'trueFalse') {
                return allResponses[idx] !== question.correctAnswer
            } else if (question.type === 'written') {
                return allResponses[idx] !== question.correctAnswer
            } else {
                return allResponses[idx] !== question.correctAnswer
            }
        })

        // Navigate to results screen
        router.push({
            pathname: '/result/result_test',
            params: {
                deckId,
                deckName,
                correctCount: String(correctCount),
                total: String(totalQuestions),
                incorrectAnswers: JSON.stringify(wrongList),
            },
        })
    }

    if (questions.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                        Preparing your test...
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{deckName || 'Test'}</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Progress */}
            <ProgressBar current={currentIndex + 1} total={totalQuestions} />

            {/* Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidView}
            >
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Question and Skip */}
                    <View style={styles.questionHeaderRow}>
                        <Text style={styles.questionText}>
                            {currentQuestion.question}
                        </Text>
                        <TouchableOpacity onPress={handleSkip}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Answer Options */}
                    {currentQuestion.type === 'written' ? (
                        <View style={styles.writtenContainer}>
                            <Text style={styles.writtenInstructions}>
                                Type your answer in the field below.
                            </Text>
                            <TextInput
                                style={styles.writtenInput}
                                value={writtenAnswer}
                                onChangeText={setWrittenAnswer}
                                placeholder="Enter your answer here..."
                                placeholderTextColor="#999"
                                multiline
                                blurOnSubmit
                                editable={!showWrittenFeedback}
                            />

                            {!showWrittenFeedback && (
                                <TouchableOpacity
                                    style={[
                                        styles.writtenAnswerButton,
                                        !writtenAnswer.trim() &&
                                            styles.writtenAnswerButtonDisabled,
                                    ]}
                                    onPress={handleCheckWrittenAnswer}
                                    disabled={!writtenAnswer.trim()}
                                >
                                    <Text style={styles.writtenButtonText}>
                                        Check Answer
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {showWrittenFeedback && (
                                <View style={styles.writtenAnswerContainer}>
                                    <View style={styles.writtenFeedbackHeader}>
                                        <Ionicons
                                            name={
                                                writtenAnswer
                                                    .trim()
                                                    .toLowerCase() ===
                                                currentQuestion.correctAnswer
                                                    .trim()
                                                    .toLowerCase()
                                                    ? 'checkmark-circle'
                                                    : 'close-circle'
                                            }
                                            size={20}
                                            color={
                                                writtenAnswer
                                                    .trim()
                                                    .toLowerCase() ===
                                                currentQuestion.correctAnswer
                                                    .trim()
                                                    .toLowerCase()
                                                    ? '#4CAF50'
                                                    : '#FF5252'
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.writtenFeedbackTitle,
                                                {
                                                    color:
                                                        writtenAnswer
                                                            .trim()
                                                            .toLowerCase() ===
                                                        currentQuestion.correctAnswer
                                                            .trim()
                                                            .toLowerCase()
                                                            ? '#4CAF50'
                                                            : '#FF5252',
                                                },
                                            ]}
                                        >
                                            {writtenAnswer
                                                .trim()
                                                .toLowerCase() ===
                                            currentQuestion.correctAnswer
                                                .trim()
                                                .toLowerCase()
                                                ? 'Correct!'
                                                : 'Incorrect'}
                                        </Text>
                                    </View>
                                    <Text style={styles.writtenAnswerLabel}>
                                        Correct Answer:
                                    </Text>
                                    <Text style={styles.writtenAnswer}>
                                        {currentQuestion.correctAnswer}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        currentQuestion.options.map((opt, idx) => (
                            <AnswerOption
                                key={idx}
                                option={opt}
                                onPress={() => handleAnswer(opt)}
                                isSelected={selectedOption === opt}
                                isCorrect={
                                    showInstantFeedback &&
                                    selectedOption !== null &&
                                    opt === currentQuestion.correctAnswer
                                }
                                isIncorrect={
                                    showInstantFeedback &&
                                    selectedOption === opt &&
                                    opt !== currentQuestion.correctAnswer
                                }
                                disabled={selectedOption !== null}
                            />
                        ))
                    )}

                    {/* Explanation for true/false questions */}
                    {showInstantFeedback &&
                        selectedOption !== null &&
                        currentQuestion.type === 'trueFalse' && (
                            <View style={styles.explanationContainer}>
                                <Text style={styles.explanationTitle}>
                                    {selectedOption ===
                                    currentQuestion.correctAnswer
                                        ? 'Correct!'
                                        : 'Incorrect!'}
                                </Text>
                                <Text style={styles.explanationText}>
                                    The correct definition of "
                                    {currentQuestion.flashcard.frontText}" is:
                                </Text>
                                <Text style={styles.actualDefinition}>
                                    {currentQuestion.actualDefinition}
                                </Text>
                            </View>
                        )}

                    {/* Next / Finish Button */}
                    {(selectedOption !== null && showInstantFeedback) ||
                        (currentQuestion.type === 'written' &&
                            showWrittenFeedback) ||
                        (selectedOption !== null && isLast && (
                            <SubmitButton
                                text={isLast ? 'Finish' : 'Next'}
                                onPress={handleNextOrFinish}
                                style={styles.nextBtn}
                            />
                        ))}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    keyboardAvoidView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#3D5CFF',
        fontWeight: '600',
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        flex: 1,
    },
    iconBtn: { padding: 8 },

    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },

    questionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    questionText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
        lineHeight: 26,
    },
    skipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3D5CFF',
    },

    nextBtn: {
        marginTop: 30,
        width: '60%',
        alignSelf: 'center',
        backgroundColor: '#3D5CFF',
    },

    // Written answer styles
    writtenContainer: {
        backgroundColor: '#F8F9FD',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8EEFF',
    },
    writtenInstructions: {
        fontSize: 16,
        color: '#444',
        marginBottom: 16,
        lineHeight: 22,
    },
    writtenInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    writtenAnswerButton: {
        backgroundColor: '#3D5CFF',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        alignSelf: 'center',
    },
    writtenAnswerButtonDisabled: {
        backgroundColor: '#B6BFE3',
    },
    writtenButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    writtenAnswerContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#3D5CFF',
    },
    writtenFeedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    writtenFeedbackTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    writtenAnswerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3D5CFF',
        marginBottom: 8,
    },
    writtenAnswer: {
        fontSize: 16,
        color: '#333',
    },
    explanationContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#F8F9FD',
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#3D5CFF',
    },
    explanationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3D5CFF',
        marginBottom: 8,
    },
    explanationText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    actualDefinition: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
})

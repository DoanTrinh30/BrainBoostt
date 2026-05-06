import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import {
    SubmitButton,
    ScoreCard,
    SectionCard,
    QuestionCountInput,
    QuickSelect,
    SettingToggle,
} from '../../components'

const fetchLastScore = async (deckId) => {
    try {
        const scoreData = await AsyncStorage.getItem(`lastScore_${deckId}`)
        if (scoreData) {
            return JSON.parse(scoreData)
        }
        return null
    } catch (error) {
        console.log('Error fetching last score:', error)
        throw error
    }
}

const SetupTestScreen = () => {
    const router = useRouter()
    const { flashcards, deckName, deckId } = useLocalSearchParams()

    const parsedFlashcards = flashcards ? JSON.parse(flashcards) : []

    // Use React Query for fetching last score
    const { data: lastScore, isLoading } = useQuery({
        queryKey: ['lastScore', deckId],
        queryFn: () => fetchLastScore(deckId),
        enabled: !!deckId,
    })

    const [testConfig, setTestConfig] = useState({
        questionCountText: parsedFlashcards.length.toString(),
        questionCount: parsedFlashcards.length,
        options: {
            instantFeedback: false,
            includeTrueFalse: true,
            includeMultipleChoice: false,
            includeWritten: false,
        },
    })

    const handleBack = () => {
        router.back()
    }

    const handleStartTest = () => {
        router.push({
            pathname: '/learning/test',
            params: {
                flashcards,
                deckName,
                deckId,
                questionCount: String(testConfig.questionCount),
                instantFeedback: String(testConfig.options.instantFeedback),
                includeTrueFalse: String(testConfig.options.includeTrueFalse),
                includeMultipleChoice: String(
                    testConfig.options.includeMultipleChoice,
                ),
                includeWritten: String(testConfig.options.includeWritten),
            },
        })
    }

    const updateOption = (option, value) => {
        setTestConfig((prev) => ({
            ...prev,
            options: {
                ...prev.options,
                [option]: value,
            },
        }))
    }

    const handleQuestionCountChange = (text) => {
        // Only allow numeric input
        if (/^\d*$/.test(text)) {
            setTestConfig((prev) => ({
                ...prev,
                questionCountText: text,
            }))

            // Convert to number and validate
            const count = parseInt(text, 10)

            if (!isNaN(count)) {
                if (count > 0 && count <= parsedFlashcards.length) {
                    setTestConfig((prev) => ({
                        ...prev,
                        questionCount: count,
                    }))
                } else if (count > parsedFlashcards.length) {
                    setTestConfig((prev) => ({
                        ...prev,
                        questionCount: parsedFlashcards.length,
                    }))
                } else {
                    setTestConfig((prev) => ({
                        ...prev,
                        questionCount: 1,
                    }))
                }
            } else {
                setTestConfig((prev) => ({
                    ...prev,
                    questionCount: 1,
                }))
            }
        }
    }

    const handleQuestionCountBlur = () => {
        setTestConfig((prev) => ({
            ...prev,
            questionCountText: prev.questionCount.toString(),
        }))
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const quickSelectOptions = [
        5,
        10,
        Math.min(16, parsedFlashcards.length),
        parsedFlashcards.length,
    ]

    const handleQuickSelect = (count) => {
        setTestConfig((prev) => ({
            ...prev,
            questionCount: count,
            questionCountText: count.toString(),
        }))
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Setup Test</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Score Card */}
                <ScoreCard
                    lastScore={lastScore}
                    isLoading={isLoading}
                    formatDate={formatDate}
                />

                {/* Question Count Section */}
                <SectionCard
                    title="Question count"
                    subtitle={`(max ${parsedFlashcards.length})`}
                    icon="help-circle-outline"
                >
                    <QuestionCountInput
                        value={testConfig.questionCountText}
                        onChange={handleQuestionCountChange}
                        onBlur={handleQuestionCountBlur}
                        maxQuestions={parsedFlashcards.length}
                    />

                    <QuickSelect
                        label="Quick select:"
                        options={quickSelectOptions}
                        selectedValue={testConfig.questionCount}
                        onSelect={handleQuickSelect}
                    />
                </SectionCard>

                {/* Question Types Section */}
                <SectionCard title="Question types" icon="list-outline">
                    <SettingToggle
                        label="True / False"
                        value={testConfig.options.includeTrueFalse}
                        onValueChange={(value) =>
                            updateOption('includeTrueFalse', value)
                        }
                    />

                    <SettingToggle
                        label="Multiple choice"
                        value={testConfig.options.includeMultipleChoice}
                        onValueChange={() => {}}
                        disabled={true}
                        comingSoon={true}
                    />

                    <SettingToggle
                        label="Written"
                        value={testConfig.options.includeWritten}
                        onValueChange={(value) =>
                            updateOption('includeWritten', value)
                        }
                    />
                </SectionCard>

                {/* Settings Section */}
                <SectionCard title="Settings" icon="chatbox-ellipses-outline">
                    <SettingToggle
                        label="Instant feedback"
                        value={testConfig.options.instantFeedback}
                        onValueChange={(value) =>
                            updateOption('instantFeedback', value)
                        }
                    />
                </SectionCard>
            </ScrollView>

            {/* Start Test Button */}
            <View style={styles.buttonContainer}>
                <SubmitButton
                    text="Start test"
                    onPress={handleStartTest}
                    style={styles.startButton}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FCFCFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
    },
    contentContainer: {
        padding: 20,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    startButton: {
        backgroundColor: '#3D5CFF',
    },
})

export default SetupTestScreen

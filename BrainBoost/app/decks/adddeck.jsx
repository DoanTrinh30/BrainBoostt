import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { PairInput, SubmitButton } from '../../components'
import Toast from 'react-native-toast-message'
import { createDeck, createFlashcards } from '../../services/deckService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    toggleVisibility,
    handleFlashcardChange,
    addFlashcardPair,
    deleteFlashcardPair,
    validateDeckData,
} from '../../helpers/flashcardUtils'

const AddDeckScreen = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    const queryClient = useQueryClient()

    const [deckInfo, setDeckInfo] = useState(() => {
        let flashcards = [
            { id: 1, term: '', definition: '' },
            { id: 2, term: '', definition: '' },
            { id: 3, term: '', definition: '' },
        ]
        if (params.flashcards) {
            try {
                const parsed = JSON.parse(params.flashcards)
                flashcards = parsed.map((card, index) => ({
                    id: index + 1,
                    term: card.front_text || card.term || '',
                    definition: card.back_text || card.definition || '',
                }))
            } catch (e) {
                // fallback to default
                flashcards = [
                    { id: 1, term: '', definition: '' },
                    { id: 2, term: '', definition: '' },
                    { id: 3, term: '', definition: '' },
                ]
            }
        }
        return {
            title: params.title || '',
            description: params.description || '',
            visibility: 'public',
            flashcards,
        }
    })

    // Create deck mutation
    const createDeckMutation = useMutation({
        mutationFn: (deckData) => createDeck(deckData),
        onSuccess: (data) => {
            // After deck is created successfully, add flashcards
            const validFlashcards = deckInfo.flashcards.filter(
                (card) =>
                    card.term.trim() !== '' && card.definition.trim() !== '',
            )

            if (validFlashcards.length > 0) {
                createFlashcardsMutation.mutate({
                    deckId: data.id,
                    flashcards: validFlashcards,
                })
            } else {
                // If no valid flashcards, just show success and navigate
                Toast.show({
                    type: 'success',
                    text1: 'Deck created successfully!',
                    position: 'top',
                })

                // Invalidate queries to refresh data
                queryClient.invalidateQueries({ queryKey: ['decks'] })
                queryClient.invalidateQueries({ queryKey: ['homeData'] })

                // Navigate back to decks screen
                router.push('/bottom/decks')
            }
        },
        onError: (error) => {
            console.error('Error creating deck:', error)
            Toast.show({
                type: 'error',
                text1: 'Failed to create deck',
                text2: error.message || 'Please try again later',
                position: 'top',
            })
        },
    })

    // Create flashcards mutation
    const createFlashcardsMutation = useMutation({
        mutationFn: ({ deckId, flashcards }) =>
            createFlashcards(deckId, flashcards),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Deck with flashcards created successfully!',
                position: 'top',
            })

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['decks'] })
            queryClient.invalidateQueries({ queryKey: ['homeData'] })

            // Navigate back to decks screen
            router.push('/bottom/decks')
        },
        onError: (error) => {
            console.error('Error creating flashcards:', error)
            Toast.show({
                type: 'error',
                text1: 'Deck created but failed to add flashcards',
                text2: error.message || 'Please try again later',
                position: 'top',
            })

            // Still navigate back since deck was created
            router.push('/bottom/decks')
        },
    })

    const handleSubmit = () => {
        if (!validateDeckData(deckInfo)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid title and description.',
                position: 'top',
            })
            return
        }

        const deckData = {
            name: deckInfo.title,
            description: deckInfo.description,
            visibility: deckInfo.visibility,
        }

        createDeckMutation.mutate(deckData)
    }

    const isSubmitting =
        createDeckMutation.isPending || createFlashcardsMutation.isPending

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Deck</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Title and Description */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter deck title"
                        value={deckInfo.title}
                        onChangeText={(text) =>
                            setDeckInfo((prev) => ({ ...prev, title: text }))
                        }
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Enter deck description"
                        value={deckInfo.description}
                        onChangeText={(text) =>
                            setDeckInfo((prev) => ({
                                ...prev,
                                description: text,
                            }))
                        }
                        multiline
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Visibility</Text>
                    <TouchableOpacity
                        style={[
                            styles.visibilitySelector,
                            deckInfo.visibility === 'private'
                                ? styles.privateSelector
                                : styles.publicSelector,
                        ]}
                        onPress={() => toggleVisibility(setDeckInfo)}
                    >
                        <Ionicons
                            name={
                                deckInfo.visibility === 'private'
                                    ? 'lock-closed'
                                    : 'earth'
                            }
                            size={20}
                            color={
                                deckInfo.visibility === 'private'
                                    ? '#FF6B6B'
                                    : '#3D5CFF'
                            }
                        />
                        <Text
                            style={[
                                styles.visibilityText,
                                deckInfo.visibility === 'private'
                                    ? styles.privateText
                                    : styles.publicText,
                            ]}
                        >
                            {deckInfo.visibility === 'private'
                                ? 'Private'
                                : 'Public'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Instructions for swipe gesture */}
                <Text style={styles.sectionTitle}>Flashcards</Text>

                <Text style={styles.instructionText}>
                    <Ionicons
                        name="information-circle-outline"
                        size={16}
                        color="#666"
                    />
                    Swipe left on a flashcard to delete it
                </Text>

                {deckInfo.flashcards.map((card) => (
                    <PairInput
                        key={card.id}
                        id={card.id}
                        term={card.term}
                        definition={card.definition}
                        onChangeText={(id, field, value) =>
                            handleFlashcardChange(id, field, value, setDeckInfo)
                        }
                        onDelete={(id) =>
                            deleteFlashcardPair(id, deckInfo, setDeckInfo)
                        }
                    />
                ))}

                {/* Submit Button */}
                <SubmitButton
                    text={isSubmitting ? 'Creating...' : 'Create Deck'}
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={isSubmitting}
                    icon={
                        isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={22}
                                color="#fff"
                            />
                        )
                    }
                />
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => addFlashcardPair(setDeckInfo)}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 60,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 80, // Ensure space for FAB
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E5FF',
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    visibilitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    publicSelector: {
        backgroundColor: '#EBF3FF',
        borderColor: '#3D5CFF',
    },
    privateSelector: {
        backgroundColor: '#FFEBEB',
        borderColor: '#FF6B6B',
    },
    visibilityText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    publicText: {
        color: '#3D5CFF',
    },
    privateText: {
        color: '#FF6B6B',
    },
    submitButton: {
        backgroundColor: '#3D5CFF',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 25,
        marginBottom: 20,
    },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: 25,
        backgroundColor: '#3D5CFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
})

export default AddDeckScreen

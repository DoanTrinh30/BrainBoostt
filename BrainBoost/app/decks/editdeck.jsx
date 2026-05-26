import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { PairInput, SubmitButton } from '../../components'
import Toast from 'react-native-toast-message'
import {
    updateDeck,
    createFlashcards,
    updateFlashcard,
} from '../../services/deckService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'

const EditDeckScreen = () => {
    const router = useRouter()
    const {
        id,
        deckData,
        flashcardData: flashcardDataString,
    } = useLocalSearchParams()
    const queryClient = useQueryClient()
    const parsedDeckData = deckData ? JSON.parse(deckData) : null

    let parsedFlashcardData = []
    try {
        if (flashcardDataString) {
            parsedFlashcardData = JSON.parse(flashcardDataString)
        }
    } catch (e) {
        console.log('Error parsing flashcardData:', e)
        Toast.show({
            type: 'error',
            text1: 'Lỗi tải thẻ học',
            text2: 'Không thể đọc dữ liệu thẻ.',
        })
    }

    if (!parsedDeckData) {
        router.back()
        Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Không có dữ liệu bộ thẻ',
        })
        return null
    }

    const [flashcards, setFlashcards] = useState(() => {
        if (parsedFlashcardData && parsedFlashcardData.length > 0) {
            return parsedFlashcardData.map((card) => ({
                id: card.id,
                term: card.frontText || card.term || '',
                definition: card.backText || card.definition || '',
                isNew: false,
            }))
        }
        return [{ id: Date.now(), term: '', definition: '', isNew: true }]
    })

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isDirty, errors },
    } = useForm({
        defaultValues: {
            title: parsedDeckData?.name || '',
            description: parsedDeckData?.description || '',
            visibility: parsedDeckData?.visibility || 'public',
            flashcards: flashcards,
        },
    })

    const updateDeckMutation = useMutation({
        mutationFn: (deckData) => updateDeck(id, deckData),
        onSuccess: () => {
            processFlashcards()
        },
        onError: (error) => {
            console.log('Error updating deck:', error)

            if (error.message && error.message.includes('permission')) {
                Toast.show({
                    type: 'error',
                    text1: 'Không có quyền',
                    text2: 'Bạn chỉ có thể chỉnh sửa bộ thẻ do bạn tạo.',
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Không thể cập nhật bộ thẻ',
                    text2: error.message || 'Vui lòng thử lại sau',
                })
            }
        },
    })

    const updateFlashcardMutation = useMutation({
        mutationFn: (flashcardData) => {
            return updateFlashcard(flashcardData.id, {
                term: flashcardData.term,
                definition: flashcardData.definition,
            })
        },
        onError: (error) => {
            console.log('Error updating flashcard:', error)
            Toast.show({
                type: 'error',
                text1: 'Không thể cập nhật thẻ',
                text2: error.message || 'Vui lòng thử lại sau',
            })
        },
    })

    const createFlashcardsMutation = useMutation({
        mutationFn: (data) => createFlashcards(id, data),
        onSuccess: () => {
            showSuccessAndNavigate()
        },
        onError: (error) => {
            console.log('Error creating flashcards:', error)
            Toast.show({
                type: 'error',
                text1: 'Không thể thêm thẻ mới',
                text2: error.message || 'Vui lòng thử lại sau',
            })
        },
    })

    const processFlashcards = async () => {
        const validFlashcards = flashcards.filter(
            (card) => card.term.trim() !== '' && card.definition.trim() !== '',
        )

        const existingCards = validFlashcards.filter((card) => !card.isNew)
        const newCards = validFlashcards.filter((card) => card.isNew)

        if (existingCards.length > 0) {
            try {
                await Promise.all(
                    existingCards.map((card) =>
                        updateFlashcardMutation.mutateAsync(card),
                    ),
                )
            } catch (error) {
                return
            }
        }

        if (newCards.length > 0) {
            createFlashcardsMutation.mutate(newCards)
        } else {
            showSuccessAndNavigate()
        }
    }

    const showSuccessAndNavigate = () => {
        Toast.show({
            type: 'success',
            text1: 'Cập nhật bộ thẻ thành công!',
            position: 'top',
        })

        queryClient.invalidateQueries({ queryKey: ['decks'] })
        queryClient.invalidateQueries({ queryKey: ['homeData'] })
        queryClient.invalidateQueries({ queryKey: ['deck', id] })

        router.push({ pathname: '/decks/deckdetail', params: { id } })
    }

    const onSubmit = (data) => {
        updateDeckMutation.mutate({
            name: data.title,
            description: data.description,
            visibility: data.visibility,
        })
    }

    const handleFlashcardChange = (id, field, value) => {
        setFlashcards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, [field]: value } : card,
            ),
        )
    }

    const addFlashcardPair = () => {
        setFlashcards((prev) => [
            ...prev,
            { id: Date.now(), term: '', definition: '', isNew: true },
        ])
    }

    const deleteFlashcardPair = (id) => {
        setFlashcards((prev) => prev.filter((card) => card.id !== id))
    }

    const isSubmitting =
        updateDeckMutation.isPending ||
        updateFlashcardMutation.isPending ||
        createFlashcardsMutation.isPending

    const hasFlashcardChanges = () => {
        const originalFlashcards = parsedFlashcardData || []
        if (flashcards.length !== originalFlashcards.length) return true

        const existingCards = flashcards.filter((card) => !card.isNew)
        for (const card of existingCards) {
            const originalCard = originalFlashcards.find(
                (origCard) => origCard.id === card.id,
            )

            const originalTerm = originalCard
                ? originalCard.frontText || originalCard.term || ''
                : ''
            const originalDefinition = originalCard
                ? originalCard.backText || originalCard.definition || ''
                : ''

            if (
                !originalCard ||
                card.term !== originalTerm ||
                card.definition !== originalDefinition
            ) {
                return true
            }
        }

        const newCardsWithContent = flashcards.filter(
            (card) =>
                card.isNew &&
                (card.term.trim() !== '' || card.definition.trim() !== ''),
        )

        return newCardsWithContent.length > 0
    }

    const isButtonDisabled =
        isSubmitting || (!isDirty && !hasFlashcardChanges())

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.iconContainer}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa bộ thẻ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Tiêu đề</Text>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.title && styles.inputError,
                                ]}
                                placeholder="Nhập tiêu đề bộ thẻ"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.title && (
                        <Text style={styles.errorText}>
                            {errors.title.message}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mô tả</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.descriptionInput,
                                    errors.description && styles.inputError,
                                ]}
                                placeholder="Nhập mô tả bộ thẻ"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                multiline
                            />
                        )}
                    />
                    {errors.description && (
                        <Text style={styles.errorText}>
                            {errors.description.message}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Quyền riêng tư</Text>
                    <Controller
                        control={control}
                        name="visibility"
                        render={({ field: { value } }) => (
                            <TouchableOpacity
                                style={[
                                    styles.visibilitySelector,
                                    value === 'private'
                                        ? styles.privateSelector
                                        : styles.publicSelector,
                                ]}
                                onPress={() => {
                                    const newValue =
                                        value === 'private'
                                            ? 'public'
                                            : 'private'
                                    setValue('visibility', newValue, {
                                        shouldDirty: true,
                                    })
                                }}
                            >
                                <Text style={styles.iconContainer}>
                                    <Ionicons
                                        name={
                                            value === 'private'
                                                ? 'lock-closed'
                                                : 'earth'
                                        }
                                        size={20}
                                        color={
                                            value === 'private'
                                                ? '#FF6B6B'
                                                : '#3D5CFF'
                                        }
                                    />
                                </Text>
                                <Text
                                    style={[
                                        styles.visibilityText,
                                        value === 'private'
                                            ? styles.privateText
                                            : styles.publicText,
                                    ]}
                                >
                                    {value === 'private'
                                        ? 'Riêng tư'
                                        : 'Công khai'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <Text style={styles.sectionTitle}>Thẻ học</Text>

                <View style={styles.instructionText}>
                    <Text style={styles.iconContainer}>
                        <Ionicons
                            name="information-circle-outline"
                            size={16}
                            color="#666"
                        />
                    </Text>
                    <Text style={styles.instructionTextContent}>
                        Vuốt trái để xóa thẻ
                    </Text>
                </View>

                {flashcards.map((card) => (
                    <PairInput
                        key={card.id}
                        id={card.id}
                        term={card.term}
                        definition={card.definition}
                        onChangeText={handleFlashcardChange}
                        onDelete={deleteFlashcardPair}
                    />
                ))}

                <SubmitButton
                    text={isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                    onPress={handleSubmit(onSubmit)}
                    style={[
                        styles.submitButton,
                        isButtonDisabled && styles.disabledButton,
                    ]}
                    disabled={isButtonDisabled}
                    icon={
                        isSubmitting && (
                            <ActivityIndicator size="small" color="#fff" />
                        )
                    }
                />
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={addFlashcardPair}>
                <Text style={styles.iconContainer}>
                    <Ionicons name="add" size={30} color="#fff" />
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: '600', color: '#333' },
    scrollContainer: { padding: 20, paddingBottom: 80 },
    inputGroup: { marginBottom: 15 },
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
    inputError: { borderColor: '#FF6B6B' },
    errorText: { color: '#FF6B6B', fontSize: 12, marginTop: 5 },
    descriptionInput: { height: 100, textAlignVertical: 'top' },
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionTextContent: { marginLeft: 10 },
    visibilitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    publicSelector: { backgroundColor: '#EBF3FF', borderColor: '#3D5CFF' },
    privateSelector: { backgroundColor: '#FFEBEB', borderColor: '#FF6B6B' },
    visibilityText: { marginLeft: 10, fontSize: 16, fontWeight: '500' },
    publicText: { color: '#3D5CFF' },
    privateText: { color: '#FF6B6B' },
    submitButton: {
        backgroundColor: '#3D5CFF',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 25,
        marginBottom: 20,
    },
    disabledButton: { backgroundColor: '#A0A0A0', opacity: 0.7 },
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
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconContainer: { alignItems: 'center', justifyContent: 'center' },
})

export default EditDeckScreen
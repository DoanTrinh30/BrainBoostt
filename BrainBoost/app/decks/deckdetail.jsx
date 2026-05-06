import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FlashcardFlipCarousel } from '../../components'
import { getDeckById } from '../../services/deckService'
import { generateDistractors } from '../../services/homeService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const DeckDetailScreen = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams()

    const {
        data: deck,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['deck', id],
        queryFn: () => getDeckById(id),
        enabled: !!id,
    })

    const generateDistractorsMutation = useMutation({
        mutationKey: ['deck', id],
        mutationFn: () => generateDistractors(deck.flashcards),
        onSuccess: (data) => {
            console.log(data.response)
            router.push({
                pathname: '/learning/learn',
                params: {
                    flashcards: JSON.stringify(deck.flashcards),
                    deckName: deck.name,
                    deckId: id,
                    data: JSON.stringify(data?.response),
                },
            })
        },
        onError: (error) => {
            console.log('Error generating distractors:', error)
            Toast.show({
                type: 'error',
                text1: 'Oops! We encountered an error',
                text2: 'Please try again later.',
            })
        },
    })

    const handleZoom = (item) => {
        router.push({
            pathname: '/learning/flashcard',
            params: {
                flashcards: JSON.stringify([item]),
                deckName: deck.name,
            },
        })
    }

    const navigateToFlashcards = () => {
        router.push({
            pathname: '/learning/flashcard',
            params: {
                flashcards: JSON.stringify(deck.flashcards),
                deckName: deck.name,
                deckId: id,
            },
        })
    }

    const navigateToLearn = async () => {
        await generateDistractorsMutation.mutateAsync()
    }

    const navigateToTestScreen = () => {
        router.push({
            pathname: '/learning/setuptest',
            params: {
                flashcards: JSON.stringify(deck.flashcards),
                deckName: deck.name,
                deckId: id,
            },
        })
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
                <ActivityIndicator size="large" color="#3D5CFF" />
            </SafeAreaView>
        )
    }

    if (isError) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
                <Text style={styles.errorText}>
                    Error loading deck: {error.message}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/bottom/decks')}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/bottom/decks')}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>{deck?.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Carousel */}
                <View style={styles.carouselContainer}>
                    <FlashcardFlipCarousel
                        data={deck.flashcards}
                        showIcon
                        onIconPress={handleZoom}
                    />
                </View>

                {/* Navigation */}
                <View style={styles.navContainer}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={navigateToFlashcards}
                    >
                        <View style={styles.iconBackground}>
                            <Image
                                source={require('../../assets/images/flashcard.png')}
                                style={styles.navIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.navLabel}>Flashcard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={navigateToLearn}
                    >
                        <View
                            style={[
                                styles.iconBackground,
                                styles.learnBackground,
                            ]}
                        >
                            {generateDistractorsMutation.isPending ? (
                                <ActivityIndicator color={'#000'} />
                            ) : (
                                <Image
                                    source={require('../../assets/images/learn.png')}
                                    style={styles.navIcon}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                        <Text style={styles.navLabel}>Learn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={navigateToTestScreen}
                    >
                        <View
                            style={[
                                styles.iconBackground,
                                styles.testBackground,
                            ]}
                        >
                            <Image
                                source={require('../../assets/images/test.png')}
                                style={styles.navIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.navLabel}>Test</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Sections */}
                <View style={styles.infoContainer}>
                    {/* Description */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="information-circle-outline"
                                size={18}
                                color="#3D5CFF"
                            />
                            <Text style={styles.sectionTitle}>Description</Text>
                        </View>
                        <View style={styles.descriptionBox}>
                            <Text style={styles.description}>
                                {deck.description || 'No description available'}
                            </Text>
                        </View>
                    </View>

                    {/* Visibility */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name={
                                    deck.visibility === 'private'
                                        ? 'lock-closed-outline'
                                        : 'globe-outline'
                                }
                                size={18}
                                color="#3D5CFF"
                            />
                            <Text style={styles.sectionTitle}>Visibility</Text>
                        </View>
                        <View
                            style={[
                                styles.visibilityContainer,
                                deck.visibility === 'private'
                                    ? styles.privateContainer
                                    : styles.publicContainer,
                            ]}
                        >
                            <Ionicons
                                name={
                                    deck.visibility === 'private'
                                        ? 'lock-closed'
                                        : 'earth'
                                }
                                size={16}
                                color={
                                    deck.visibility === 'private'
                                        ? '#FF6B6B'
                                        : '#3D5CFF'
                                }
                                style={styles.visibilityIcon}
                            />
                            <Text
                                style={[
                                    styles.visibilityText,
                                    deck.visibility === 'private'
                                        ? styles.privateText
                                        : styles.publicText,
                                ]}
                            >
                                {deck.visibility === 'private'
                                    ? 'Private'
                                    : 'Public'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Preview Flashcards */}
                <View style={styles.previewContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="card-outline"
                            size={18}
                            color="#3D5CFF"
                        />
                        <Text style={styles.sectionTitle}>
                            Preview flashcards
                        </Text>
                    </View>

                    {deck.flashcards.map((item, idx) => (
                        <View key={idx} style={styles.flashcardPreview}>
                            <View style={styles.flashcardTerm}>
                                <View style={styles.termHeader}>
                                    <Text style={styles.previewLabel}>
                                        Term
                                    </Text>
                                    <View style={styles.termIndicator} />
                                </View>
                                <Text style={styles.previewTermText}>
                                    {item.frontText}
                                </Text>
                            </View>
                            <View style={styles.flashcardDefinition}>
                                <View style={styles.definitionHeader}>
                                    <Text style={styles.previewLabel}>
                                        Definition
                                    </Text>
                                    <View style={styles.definitionIndicator} />
                                </View>
                                <Text style={styles.previewDefinitionText}>
                                    {item.backText}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: { flex: 1, backgroundColor: '#F8F9FD' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: { paddingBottom: 40 },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    carouselContainer: { marginTop: 20, paddingHorizontal: 15 },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 24,
        borderRadius: 24,
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 20,
        shadowColor: 'rgba(61,92,255,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 3,
    },
    navButton: { alignItems: 'center', justifyContent: 'center', width: '30%' },
    iconBackground: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8EFFF',
        marginBottom: 8,
    },
    learnBackground: { backgroundColor: '#E6FFF0' },
    testBackground: { backgroundColor: '#FFE6E6' },
    navIcon: { width: 32, height: 32 },
    navLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 4 },
    infoContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 22,
        marginTop: 20,
        shadowColor: '#3D5CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    section: { marginBottom: 20 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
        color: '#333',
    },
    descriptionBox: {
        backgroundColor: '#F0F5FF',
        borderRadius: 16,
        padding: 18,
        borderLeftWidth: 4,
        borderLeftColor: '#3D5CFF',
    },
    description: { fontSize: 15, color: '#444', lineHeight: 22 },
    visibilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 14,
    },
    publicContainer: { backgroundColor: '#EBF3FF' },
    privateContainer: { backgroundColor: '#FFEBEB' },
    visibilityIcon: { marginRight: 8 },
    visibilityText: { fontSize: 15, fontWeight: '600' },
    privateText: { color: '#FF6B6B' },
    publicText: { color: '#3D5CFF' },
    previewContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 22,
        marginTop: 20,
        shadowColor: '#3D5CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 30,
    },
    flashcardPreview: {
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E8EEFF',
        shadowColor: '#3D5CFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    flashcardTerm: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EEFF',
    },
    flashcardDefinition: { padding: 16, backgroundColor: '#F8FAFF' },
    termHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    definitionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    termIndicator: {
        width: 24,
        height: 6,
        backgroundColor: '#3D5CFF',
        borderRadius: 3,
    },
    definitionIndicator: {
        width: 24,
        height: 6,
        backgroundColor: '#7B93FF',
        borderRadius: 3,
    },
    previewLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
        textTransform: 'uppercase',
    },
    previewTermText: { fontSize: 17, fontWeight: '600', color: '#333' },
    previewDefinitionText: { fontSize: 17, color: '#444' },
    errorText: {
        color: '#FF6B6B',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3D5CFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
})

export default DeckDetailScreen

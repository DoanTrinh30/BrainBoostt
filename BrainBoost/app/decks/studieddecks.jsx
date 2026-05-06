import React, { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getAllDecks } from '../../services/deckService'
import { DeckCard } from '../../components'
import { useRouter, useLocalSearchParams } from 'expo-router'

export default function StudiedDecksScreen() {
    const router = useRouter()
    const { classTitle, returnTo } = useLocalSearchParams()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['decks'],
        queryFn: getAllDecks,
    })

    const [selectedDecks, setSelectedDecks] = useState([])

    const handleSelectDeck = (deck) => {
        setSelectedDecks((prev) => {
            const exists = prev.find((d) => d.id === deck.id)
            return exists
                ? prev.filter((d) => d.id !== deck.id)
                : [...prev, deck]
        })
    }

    const handleDone = () => {
        if (returnTo === 'classdetail') {
            router.replace({
                pathname: '/decks/classdetail',
                params: {
                    classTitle,
                    selectedDecks: JSON.stringify(selectedDecks),
                },
            })
        }
    }
    const handleEditDeck = (deck) => {
        router.push({
            pathname: '/decks/editdeck',
            params: {
                id: deck.id,
                deckData: JSON.stringify(deck),
            },
        })
    }

    const handleStudyDeck = (deckId) => {
        router.push({
            pathname: '/decks/deckdetail',
            params: { id: deckId },
        })
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View />
                <TouchableOpacity onPress={handleDone}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Add Deck</Text>
                <TouchableOpacity onPress={() => router.push('/decks/adddeck')}>
                    <Text style={styles.newSetText}>+ Create new decks</Text>
                </TouchableOpacity>

                {isLoading && <Text>Loading...</Text>}
                {isError && (
                    <Text style={styles.errorText}>Lỗi: {error.message}</Text>
                )}

                <FlatList
                    data={data?.decks || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <DeckCard
                            name={item.name}
                            description={item.description}
                            visibility={item.visibility ?? 'private'}
                            updatedAt={item.updatedAt}
                            onPress={() => handleSelectDeck(item)}
                            onEdit={() => handleEditDeck(item)}
                            onStudy={() => handleStudyDeck(item.id)}
                            isSelected={
                                !!selectedDecks.find((d) => d.id === item.id)
                            }
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    doneText: {
        fontSize: 16,
        color: '#3D5CFF',
        fontWeight: '600',
    },
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#1A1F36',
    },
    newSetText: {
        color: '#3D5CFF',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 30,
    },
})

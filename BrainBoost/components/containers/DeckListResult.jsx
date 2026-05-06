import React, { useCallback } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function DeckListResult({ decks }) {
    const router = useRouter()

    const navigateToDeckDetail = useCallback(
        (deck) => {
            router.push({
                pathname: '/decks/deckdetail',
                params: { id: deck.id },
            })
        },
        [router],
    )

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.deckContainer}
            onPress={() => navigateToDeckDetail(item)}
        >
            <View style={styles.deckInfo}>
                <Text style={styles.deckName}>
                    {item.name || 'Unnamed Deck'}
                </Text>
                <Text style={styles.deckDesc}>{item.description ?? 'N/A'}</Text>
                <View style={styles.authorContainer}>
                    <Ionicons
                        name="person-circle-outline"
                        size={24}
                        color="#888"
                    />
                    <Text style={styles.authorName}>
                        {item.author.username ?? 'Unknown'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <FlatList
            data={decks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    )
}

const styles = StyleSheet.create({
    deckContainer: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    deckInfo: {
        gap: 8,
    },
    deckName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    deckDesc: {
        fontSize: 14,
        color: '#666',
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    authorName: {
        marginLeft: 8,
        fontSize: 14,
        color: '#444',
    },
})

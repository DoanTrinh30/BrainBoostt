import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const DeckList = ({ modules, onAddDeck }) => (
    <View>
        {modules.map((mod) => (
            <Text key={mod.id} style={styles.moduleItem}>
                📘 {mod.name}
            </Text>
        ))}
        <TouchableOpacity onPress={onAddDeck} style={styles.addButtonSecondary}>
            <Text style={styles.addButtonText}>Add More Decks</Text>
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    moduleItem: {
        fontSize: 16,
        marginBottom: 12,
        color: '#000',
    },
    addButtonSecondary: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: 'center',
        marginTop: 24,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default DeckList

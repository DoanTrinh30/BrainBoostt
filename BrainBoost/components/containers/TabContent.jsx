import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import DeckListResult from './DeckListResult'

export default function TabContent({ activeTab, searchResults }) {
    if (activeTab === 'All results' || activeTab === 'Decks') {
        return (
            <>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>SEARCH RESULTS</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View all</Text>
                    </TouchableOpacity>
                </View>
                <DeckListResult decks={searchResults} />
            </>
        )
    }

    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No results in "{activeTab}"</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1F36' },
    viewAll: { fontSize: 14, color: '#3D5CFF' },
    emptyState: { padding: 40, alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#888' },
})

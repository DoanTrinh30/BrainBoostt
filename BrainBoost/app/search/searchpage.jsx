import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { searchAll } from '../../services/searchService'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import TabContent from '../../components/containers/TabContent'

const TABS = ['All results', 'Decks', 'Classes', 'Folders', 'Users']

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('All results')

    const router = useRouter()

    const { data } = useQuery({
        queryKey: ['search', searchQuery],
        queryFn: () => searchAll(searchQuery),
        enabled: searchQuery.length > 0,
    })

    const searchResults = data?.decks ?? []

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.searchBarContainer}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#333"
                        style={styles.backIcon}
                        onPress={() => router.back()}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for decks..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text ?? '')}
                    />
                    {searchQuery?.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons
                                name="close"
                                size={24}
                                color="#333"
                                style={styles.clearIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.tabsContainer}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tab,
                                    activeTab === tab && styles.activeTab,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {searchQuery.length > 0 && (
                    <TabContent
                        activeTab={activeTab}
                        searchResults={searchResults}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginVertical: 15,
    },
    backIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, paddingVertical: 10 },
    clearIcon: { marginLeft: 10 },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 15,
    },
    tab: { fontSize: 14, color: '#888', paddingBottom: 10 },
    activeTab: {
        color: '#3D5CFF',
        fontWeight: '600',
        borderBottomWidth: 2,
        borderBottomColor: '#3D5CFF',
    },
})

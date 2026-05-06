import React, { useState, useCallback, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import BottomModal from '../../components/containers/BottomModal'
import DeckCard from '../../components/containers/DeckCard'
import MembersList from '../../components/containers/MembersList'

const ClassDetailScreen = () => {
    const router = useRouter()
    const { classTitle: initialClassTitle = 'Name Class', selectedDecks } =
        useLocalSearchParams()

    const [classTitle, setClassTitle] = useState(initialClassTitle)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [activeTab, setActiveTab] = useState('Modules')
    const [modules, setModules] = useState([])
    const [isMoreVisible, setIsMoreVisible] = useState(false)

    useEffect(() => {
        if (selectedDecks) {
            try {
                const decks = JSON.parse(selectedDecks)
                setModules(decks)
            } catch (e) {
                console.error('Lỗi parse selectedDecks:', e)
            }
        }
    }, [selectedDecks])

    // Khi hoàn thành chỉnh sửa tên lớp
    const handleSubmitTitle = () => {
        setIsEditingTitle(false)
        // TODO: Gọi API cập nhật tên lớp nếu cần
        // ví dụ: updateClassTitle(classTitle)
    }

    const handleAddDeck = useCallback(() => {
        setIsMoreVisible(false)
        router.push({
            pathname: '/decks/studieddecks',
            params: { classTitle, returnTo: 'classdetail' },
        })
    }, [router, classTitle])

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsEditingTitle(true)}
                    style={styles.headerContent}
                    activeOpacity={0.7}
                >
                    {!isEditingTitle ? (
                        <Text style={styles.classTitle}>{classTitle}</Text>
                    ) : (
                        <TextInput
                            style={styles.classTitleInput}
                            value={classTitle}
                            onChangeText={setClassTitle}
                            onBlur={handleSubmitTitle}
                            onSubmitEditing={handleSubmitTitle}
                            autoFocus
                            returnKeyType="done"
                            maxLength={50}
                        />
                    )}
                </TouchableOpacity>

                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => console.log('Share')}>
                        <Ionicons name="share-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsMoreVisible(true)}
                        style={styles.moreButton}
                    >
                        <Ionicons
                            name="ellipsis-vertical"
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {['Modules', 'Members'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tabItem,
                            activeTab === tab && styles.activeTabItem,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab === 'Modules' ? 'Decks' : 'Members'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'Modules' ? (
                    modules.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyTitle}>
                                This class has no decks yet.
                            </Text>
                            <Text style={styles.emptyDesc}>
                                Add or create a deck to get started.
                            </Text>
                            <TouchableOpacity
                                onPress={handleAddDeck}
                                style={styles.addButton}
                            >
                                <Text style={styles.addButtonText}>
                                    Add Deck
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={modules}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <DeckCard
                                    name={item.name}
                                    description={item.description}
                                    visibility={item.visibility}
                                    updatedAt={item.updatedAt}
                                    onPress={() => {}}
                                />
                            )}
                            scrollEnabled={false}
                        />
                    )
                ) : (
                    <MembersList />
                )}
            </ScrollView>

            {/* Modal bottom sheet */}
            <BottomModal
                isVisible={isMoreVisible}
                onClose={() => setIsMoreVisible(false)}
                onAddDeck={handleAddDeck}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: { paddingRight: 10 },
    headerContent: {
        flex: 1,
        marginLeft: 12,
    },
    classTitle: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    classTitleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#007AFF',
        paddingVertical: 2,
        color: '#000',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreButton: { marginLeft: 16 },
    tabBar: {
        flexDirection: 'row',
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTabItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#3D5CFF',
    },
    tabText: {
        color: '#888',
        fontSize: 16,
    },
    activeTabText: {
        color: '#3D5CFF',
        fontWeight: 'bold',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    emptyBox: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
    emptyTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyDesc: {
        color: '#555',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#3D5CFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default ClassDetailScreen

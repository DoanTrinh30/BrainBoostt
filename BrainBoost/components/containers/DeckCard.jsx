import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { formatDistanceToNow } from 'date-fns'

export default function DeckCard({
    name,
    description,
    visibility,
    updatedAt,
    onPress,
    onEdit,
    onStudy,
    isSelected = false,
}) {
    const lastUpdated = formatDistanceToNow(new Date(updatedAt), {
        addSuffix: true,
    })

    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Header */}
            <View style={styles.header}>
                <MaterialCommunityIcons
                    name={visibility === 'private' ? 'lock-outline' : 'earth'}
                    size={20}
                    color="#666"
                />
                <Text style={styles.visibilityText}>
                    {visibility
                        ? visibility.charAt(0).toUpperCase() +
                          visibility.slice(1)
                        : 'Ẩn danh'}
                </Text>

                <View style={styles.rightIcons}>
                    {isSelected && (
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#3D5CFF"
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={onEdit}
                        activeOpacity={0.6}
                    >
                        <Ionicons name="pencil" size={18} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {name}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                    {description || 'No description provided.'}
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.updatedText}>Updated {lastUpdated}</Text>
                <TouchableOpacity
                    style={styles.studyButton}
                    onPress={onStudy}
                    activeOpacity={0.6}
                >
                    <Text style={styles.studyButtonText}>Study</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F8F9FF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E5FF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    selectedCard: {
        borderColor: '#3D5CFF',
        borderWidth: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    visibilityText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        marginBottom: 12,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1A1F36',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E0E5FF',
        paddingTop: 10,
        marginTop: 4,
    },
    updatedText: {
        fontSize: 12,
        color: '#999',
    },
    studyButton: {
        backgroundColor: '#3D5CFF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    studyButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    editButton: {
        padding: 5,
    },
})

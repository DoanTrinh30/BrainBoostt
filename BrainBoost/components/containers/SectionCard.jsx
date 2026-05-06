import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Section card component with icon header and optional subtitle
 */
const SectionCard = ({
    title,
    subtitle,
    icon,
    iconColor = '#3D5CFF',
    children,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name={icon} size={22} color={iconColor} />
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.content}>{children}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginLeft: 10,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#888888',
        marginLeft: 6,
    },
    content: {},
})

export default SectionCard

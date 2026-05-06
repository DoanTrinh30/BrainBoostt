import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

export default function StatItem({ iconName, iconColor, number, label }) {
    return (
        <View style={styles.statItem}>
            <View style={styles.iconContainer}>
                <Icon name={iconName} size={30} color={iconColor} />
            </View>
            <Text style={styles.statNumber}>{number}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    statItem: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 15,
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        width: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#333333',
    },
    statLabel: {
        fontSize: 12,
        color: '#757575',
        marginTop: 5,
        fontWeight: '500',
    },
})

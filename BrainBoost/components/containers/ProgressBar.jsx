import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ProgressBar = ({ current, total }) => {
    const progress = (current / total) * 100

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.progressText}>{current}</Text>
                <Text style={styles.progressText}>{total}</Text>
            </View>
            <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${progress}%` }]} />
            </View>
        </View>
    )
}

export default ProgressBar

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressText: {
        fontSize: 12,
        color: '#888',
    },
    barBackground: {
        height: 6,
        backgroundColor: '#EEE',
        borderRadius: 10,
    },
    barFill: {
        height: 6,
        backgroundColor: '#3D5CFF',
        borderRadius: 10,
    },
})

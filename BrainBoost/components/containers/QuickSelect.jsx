import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

/**
 * Component for quickly selecting from predefined options
 */
const QuickSelect = ({ label, options, selectedValue, onSelect }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.optionsContainer}>
                {options.map((option, index) => {
                    // Skip rendering duplicates
                    if (index > 0 && option === options[index - 1]) {
                        return null
                    }

                    return (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.option,
                                selectedValue === option &&
                                    styles.optionSelected,
                            ]}
                            onPress={() => onSelect(option)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedValue === option &&
                                        styles.optionTextSelected,
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#555555',
        marginBottom: 8,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    option: {
        width: '22%',
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionSelected: {
        backgroundColor: '#3D5CFF',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555555',
    },
    optionTextSelected: {
        color: '#FFFFFF',
    },
})

export default QuickSelect

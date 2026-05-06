import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

/**
 * Input component for entering the number of questions with validation
 */
const QuestionCountInput = ({ value, onChange, onBlur, maxQuestions }) => {
    const isGreaterThanMax = parseInt(value, 10) > maxQuestions
    const isInvalid =
        (parseInt(value, 10) <= 0 || isNaN(parseInt(value, 10))) && value !== ''

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <Text style={styles.label}>Enter number of questions:</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={3}
                    placeholder="Count"
                />
            </View>

            {isGreaterThanMax && (
                <Text style={styles.warning}>
                    Maximum {maxQuestions} questions available
                </Text>
            )}

            {isInvalid && (
                <Text style={styles.warning}>Minimum 1 question required</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#555555',
        flex: 1,
    },
    input: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: 80,
        textAlign: 'center',
    },
    warning: {
        fontSize: 13,
        color: '#FF6B6B',
        marginTop: 6,
        textAlign: 'right',
    },
})

export default QuestionCountInput

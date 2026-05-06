import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const AnswerOption = ({
    option,
    onPress,
    isCorrect,
    isIncorrect,
    isSelected,
    disabled,
}) => {
    const shouldShowCorrect = isCorrect && isSelected !== null
    const shouldShowIncorrect = isIncorrect && isSelected !== null

    let optionStyle = [styles.optionButton]
    let textStyle = [styles.optionText]
    let showIcon = false
    let iconName = ''
    let iconColor = ''

    if (isSelected) {
        optionStyle.push(styles.selectedOption)
    }

    if (shouldShowCorrect) {
        optionStyle.push(styles.correctOption)
        textStyle.push(styles.correctText)
        showIcon = true
        iconName = 'checkmark-circle'
        iconColor = '#4CAF50'
    } else if (shouldShowIncorrect) {
        optionStyle.push(styles.wrongOption)
        textStyle.push(styles.wrongText)
        showIcon = true
        iconName = 'close-circle'
        iconColor = '#FF5252'
    }

    return (
        <TouchableOpacity
            style={optionStyle}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={textStyle}>{option}</Text>
            {showIcon && (
                <Ionicons
                    name={iconName}
                    size={20}
                    color={iconColor}
                    style={styles.icon}
                />
            )}
        </TouchableOpacity>
    )
}

export default AnswerOption

const styles = StyleSheet.create({
    optionButton: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedOption: {
        borderColor: '#3D5CFF',
        backgroundColor: '#F0F5FF',
    },
    correctOption: {
        backgroundColor: '#E6FFF0',
        borderColor: '#4CAF50',
    },
    wrongOption: {
        backgroundColor: '#FFE6E6',
        borderColor: '#FF5252',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    correctText: {
        color: '#1B5E20',
        fontWeight: '600',
    },
    wrongText: {
        color: '#C62828',
        fontWeight: '600',
    },
    icon: {
        marginLeft: 8,
    },
})

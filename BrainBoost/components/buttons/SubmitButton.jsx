import React from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native'

export default function SubmitButton({
    onPress,
    text,
    style,
    textStyle,
    icon,
    isLoading = false,
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style]}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                {icon && <View style={styles.iconWrapper}>{icon}</View>}
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={[styles.buttonText, textStyle]}>{text}</Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3D5CFF',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

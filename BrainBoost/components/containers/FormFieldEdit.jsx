import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// FormField component for reusable form groups in React Native
export default function FormFieldEdit({
    label,
    name,
    type = 'text',
    value,
    onChange,
    prefix,
    suffix,
    keyboardType = 'default',
    secureTextEntry = false
}) {
    return (
        <View style={styles.formGroup}>
            <Text style={styles.label}>{label}</Text>

            {!prefix && !suffix ? (
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => onChange(name, text)}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry || type === 'password'}
                />
            ) : (
                <View style={styles.inputWithIcon}>
                    {prefix && <Text style={styles.inputPrefix}>{prefix}</Text>}
                    <TextInput
                        style={[
                            styles.input,
                            prefix ? styles.inputWithPaddingLeft : null,
                            suffix ? styles.inputWithPaddingRight : null
                        ]}
                        value={value}
                        onChangeText={(text) => onChange(name, text)}
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry || type === 'password'}
                    />
                    {suffix && (
                        <View style={styles.inputSuffix}>
                            {suffix}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#666',
    },
    inputWithIcon: {
        position: 'relative',
    },
    inputPrefix: {
        position: 'absolute',
        left: 10,
        top: 12,
        zIndex: 1,
        color: '#666',
    },
    inputWithPaddingLeft: {
        paddingLeft: 25,
    },
    inputWithPaddingRight: {
        paddingRight: 40,
    },
    inputSuffix: {
        position: 'absolute',
        right: 10,
        top: 5,
        zIndex: 1,
    },
});
import React from "react";
import {
    TextInput,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PasswordField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    isPasswordVisible,
    togglePasswordVisibility,
    onFocus,
    onBlur,
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!isPasswordVisible}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={
                            isPasswordVisible
                                ? "eye-outline"
                                : "eye-off-outline"
                        }
                        size={24}
                        color="#A0A0A0"
                    />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: "#6F6F6F",
        alignSelf: "flex-start",
        marginBottom: 5,
        marginTop: 10,
    },
    passwordContainer: {
        width: "100%",
        position: "relative",
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        top: 13,
    },
    errorText: {
        fontSize: 12,
        color: "red",
        marginTop: 5,
    },
});

export default PasswordField;

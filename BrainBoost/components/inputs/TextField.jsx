import React, { useEffect, useState } from "react";
import { TextInput, Text, StyleSheet, View } from "react-native";

// Hàm kiểm tra tính hợp lệ của email
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const TextField = ({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize, isEmail = false }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        if (!isFocus && value && value.length > 0 && !validateEmail(value)) setErrorMessage("Please enter a valid email address.");
        else setErrorMessage("");
    }, [isFocus]);

    const handleFocus = () => setIsFocus(true);
    const handleBlur = () => setIsFocus(false);
    const handleChange = (text) => onChangeText(text);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={handleChange} keyboardType={keyboardType} autoCapitalize={autoCapitalize} onFocus={handleFocus} onBlur={handleBlur} />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        color: "red",
        marginTop: 5,
    },
});

export default TextField;

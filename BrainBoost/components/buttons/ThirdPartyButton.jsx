import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function ThirdPartyButton({ size, onPress, children }) {
    const buttonSize = size || 80;

    return (
        <TouchableOpacity style={[styles.button, { width: buttonSize, height: buttonSize }]} onPress={onPress} activeOpacity={0.8}>
            {children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: 25,
        marginHorizontal: 15,
    },
});

// app/components/ui/DividerWithText.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DividerWithText = ({ text }) => {
    return (
        <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>{text}</Text>
            <View style={styles.divider} />
        </View>
    );
};

const styles = StyleSheet.create({
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    orText: {
        fontSize: 14,
        color: "#6F6F6F",
        marginHorizontal: 10,
    },
});

export default DividerWithText;

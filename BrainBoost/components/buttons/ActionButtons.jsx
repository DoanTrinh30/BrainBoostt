import React from "react";
import { View, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";

const ActionButtons = ({ handleSignUp, handleLogin }) => (
    <View style={styles.buttonsContainer}>
        <SubmitButton text="Sign Up" onPress={handleSignUp} style={styles.signUpButton} />
        <SubmitButton text="Log In" onPress={handleLogin} style={styles.logInButton} textStyle={{ color: "#3D5CFF" }} />
    </View>
);

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 120,
        marginTop: 20,
    },
    signUpButton: {
        width: 120,
        marginRight: 20,
    },
    logInButton: {
        width: 120,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#3D5CFF",
    },
});

export default ActionButtons;

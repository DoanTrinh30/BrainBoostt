import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../services/authService";
import { TextField, PasswordField, SubmitButton, OtherOption, DividerWithText, ThirdPartyContainer, ThirdPartyButton, Logo } from "../../components";
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isFocusOnConfirmPassword, setIsFocusOnConfirmPassword] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const mutation = useMutation({
        mutationFn: signUp,
        onSuccess: async (data) => {
            await AsyncStorage.setItem('token', data.token)
            dispatch(setCredentials({
                accessToken: data.token
            }))
            Toast.show({
                type: 'success',
                text1: 'Sign up successful',
                text2: 'Welcome to BrainBoost!',
                position: 'top'
            });
            router.push("/(tabs)")
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Sign up error',
                text2: error.message || "An unexpected error occurred. Please try again.",
                position: 'top'
            });
        }
    })

    const handleSignUp = () => {
        if (!email || !password || !confirmPassword) {
            Toast.show({
                type: 'info',
                text1: 'Missing information',
                text2: 'Please fill in all fields.',
                position: 'top'
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password mismatch',
                text2: 'Passwords do not match.',
                position: 'top'
            });
            return;
        }

        mutation.mutate({ email, password, confirmPassword });
    }

    useEffect(() => {
        if (!isFocusOnConfirmPassword && confirmPassword.length > 0 && password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    }, [isFocusOnConfirmPassword, confirmPassword, password]);

    const navigateToLogIn = () => router.push("/auth/login");

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Sign Up</Text>

                    <TextField label="Your Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" isEmail={true} />

                    <PasswordField
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        error={""}
                        isPasswordVisible={isPasswordVisible}
                        togglePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                    />

                    <PasswordField
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        error={confirmPasswordError}
                        isPasswordVisible={isConfirmPasswordVisible}
                        togglePasswordVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        onFocus={() => setIsFocusOnConfirmPassword(true)}
                        onBlur={() => setIsFocusOnConfirmPassword(false)}
                    />

                    <SubmitButton text={mutation.isPending ? <ActivityIndicator color="#FFF" style={styles.loader} size="large" /> :"Sign Up"} onPress={handleSignUp} />

                    <OtherOption textContent={"Already have an account?"} linkContent={"Log In"} onPress={navigateToLogIn} />

                    <DividerWithText text="Or sign up with" />

                    <ThirdPartyContainer>
                        <ThirdPartyButton iconName="logo-google" size={40}>
                            <Logo logoType="google" size={40} />
                        </ThirdPartyButton>
                        <ThirdPartyButton iconName="logo-facebook" size={40}>
                            <Logo logoType="facebook" size={40} />
                        </ThirdPartyButton>
                    </ThirdPartyContainer>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F7",
        paddingHorizontal: 20,
    },
    content: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "white",
        padding: 25,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 50,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    loader: {
        paddingVertical: 5
    },
});

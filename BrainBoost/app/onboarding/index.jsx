import React, { useState } from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SkipButton, SwiperComponent, ActionButtons, PaginationDots } from "../../components";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
    const router = useRouter();

    const slides = [
        {
            title: "Quick and easy learning",
            subtitle: "Easy and fast learning at any time to help you improve various skills",
            image: require("../../assets/images/onboarding01.png"),
        },
        {
            title: "Flexible learning",
            subtitle: "Learn at your own pace with flexible schedules and expert guidance",
            image: require("../../assets/images/onboarding02.png"),
        },
        {
            title: "Create your own study plan",
            subtitle: "Study according to the study plan, make study more motivated",
            image: require("../../assets/images/onboarding03.png"),
            buttons: true,
        },
    ];

    const [currentPage, setCurrentPage] = useState(0);

    const handlePaginationChange = (index) => {
        setCurrentPage(index);
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    };

    const handleLogin = async () => {
        await completeOnboarding();
        router.push("/auth/login");
    };

    const handleSignUp = async () => {
        await completeOnboarding();
        router.push("/auth/signup");
    };

    const handleSkip = async () => {
        await completeOnboarding();
        router.push("/auth/login");
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
            <View style={styles.container}>
                <SkipButton hideSkip={currentPage === 2} onSkip={handleSkip} />

                <SwiperComponent slides={slides} onPageChange={handlePaginationChange} />

                {slides[currentPage].buttons && <ActionButtons handleSignUp={handleSignUp} handleLogin={handleLogin} />}

                <View style={styles.paginationContainer}>
                    <PaginationDots currentPage={currentPage} totalPages={slides.length} onPageChange={handlePaginationChange} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        position: "relative",
    },
    paginationContainer: {
        position: "absolute",
        bottom: Platform.OS === "ios" ? height * 0.08 : height * 0.05,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: width * 0.05,
    },
});

export default OnboardingScreen;

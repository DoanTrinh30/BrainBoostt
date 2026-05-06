import React from "react";
import { View, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import OnboardingImage from "../others/OnboardingImage";
import OnboardingText from "../others/OnboardingText";

const SwiperComponent = ({ slides, onPageChange }) => (
    <Swiper showsPagination={false} loop={false} autoplay={false} onIndexChanged={onPageChange}>
        {slides.map((slide, index) => (
            <View key={index} style={styles.slide}>
                <OnboardingImage imageSource={slide.image} />
                <OnboardingText title={slide.title} subtitle={slide.subtitle} />

                {slide.buttons && <View style={styles.buttonsContainer}></View>}
            </View>
        ))}
    </Swiper>
);

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    buttonsContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
});

export default SwiperComponent;

import React from "react";
import { View, Image, StyleSheet } from "react-native";

const OnboardingImage = ({ imageSource }) => (
  <View style={styles.imageContainer}>
    <Image source={imageSource} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 50,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default OnboardingImage;

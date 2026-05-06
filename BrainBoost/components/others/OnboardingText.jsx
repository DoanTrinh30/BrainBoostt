import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OnboardingText = ({ title, subtitle }) => (
  <View style={styles.textContainer}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  textContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 17,
    color: "gray",
    textAlign: "center",
  },
});

export default OnboardingText;

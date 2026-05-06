import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const DeckNavItem = ({ icon, label, style, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image source={icon} style={[styles.icon, style]} />
    <Text>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  icon: {

    marginBottom: 5,
  },
});

export default DeckNavItem;

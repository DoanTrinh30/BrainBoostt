import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FlashcardPreviewItem = ({ term, definition }) => (
  <View style={styles.card}>
    <Text style={styles.text}>
      Term: <Text style={styles.bold}>{term}</Text>
    </Text>
    <Text style={styles.text}>
      Definition: <Text style={styles.bold}>{definition}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default FlashcardPreviewItem;

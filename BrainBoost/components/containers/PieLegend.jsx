import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PieLegend = ({ data = [] }) => {
  return (
    <View style={styles.legendContainer}>
      {data.map((item, index) => (
        <View key={`${item.name}-${index}`} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>
            {item.percentage}% {item.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
});

export default PieLegend;

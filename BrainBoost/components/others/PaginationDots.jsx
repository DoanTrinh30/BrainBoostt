import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const PaginationDots = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <View style={styles.dotsContainer}>
            {Array.from({ length: totalPages }).map((_, index) => (
                <TouchableOpacity key={index} style={[styles.dot, currentPage === index && styles.activeDot]} onPress={() => onPageChange(index)} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    dotsContainer: {
        flexDirection: "row",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "lightgray",
        marginHorizontal: 4,
        transition: "all 0.3s ease",
    },
    activeDot: {
        backgroundColor: "blue",
        transform: [{ scale: 1.2 }],
    },
});

export default PaginationDots;

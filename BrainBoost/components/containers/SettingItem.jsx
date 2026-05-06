import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SettingItem = ({ iconName, label, onPress }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View style={styles.iconLabelContainer}>
            <Ionicons name={iconName} size={26} color="black" />
            <Text style={styles.itemLabel}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="black" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#a6a6a6",
    },
    iconLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemLabel: {
        fontSize: 16,
        marginLeft: 15,
    },
});

export default SettingItem;
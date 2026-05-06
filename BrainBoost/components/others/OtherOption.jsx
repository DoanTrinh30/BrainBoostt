import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

export default function OtherOption({ textContent, linkContent, onPress }) {
    return (
        <View style={styles.container}>
            <Text style={styles.textPart}>{textContent}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.linkPart}>{linkContent}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
    },
    textPart: {
        fontSize: 14,
        color: "#6F6F6F",
    },
    linkPart: {
        color: "#3D5CFF",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 5,
    },
});

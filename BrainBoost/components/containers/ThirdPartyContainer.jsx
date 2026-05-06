import { StyleSheet, View } from "react-native";

export default function ThirdPartyContainer({ children }) {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 15,
    },
});

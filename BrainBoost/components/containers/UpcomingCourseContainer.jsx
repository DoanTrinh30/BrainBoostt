import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

const UpcomingCourseContainer = ({ courses, selectedIndex, onScroll, onPressCourse }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContainer}
        >
            {courses.map((course, index) => {
                const isActive = index === selectedIndex;
                const lastUpdated = formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true });

                return (
                    <TouchableOpacity
                        key={course.id}
                        style={[
                            styles.courseContainer,
                            isActive && styles.activeCourse,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => onPressCourse(course)}
                    >
                        <View style={styles.header}>
                            <MaterialCommunityIcons
                                name={course.visibility === "private" ? "lock" : "earth"}
                                size={20}
                                color={isActive ? "#3D5CFF" : "#666"}
                            />
                            <Text style={styles.visibilityText}>
                                {course.visibility === "private" ? "Private" : "Public"}
                            </Text>
                        </View>

                        <View style={styles.content}>
                            <MaterialCommunityIcons
                                name="notebook"
                                size={28}
                                color={isActive ? "#3D5CFF" : "#666"}
                                style={styles.icon}
                            />
                            <Text style={[styles.title, isActive && styles.activeTitle]}>
                                {course.name}
                            </Text>
                            <Text style={styles.description} numberOfLines={2}>
                                {course.description}
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.timeText}>
                                Updated {lastUpdated}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
    },
    courseContainer: {
        width: CARD_WIDTH,
        marginRight: 20,
        borderRadius: 16,
        backgroundColor: "#fff",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#eee",
    },
    activeCourse: {
        borderColor: "#3D5CFF",
        backgroundColor: "#F6F9FF",
        shadowColor: "#3D5CFF",
        shadowOpacity: 0.15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    visibilityText: {
        marginLeft: 6,
        fontSize: 12,
        color: "#666",
    },
    content: {
        alignItems: "center",
        marginBottom: 16,
    },
    icon: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginBottom: 8,
    },
    activeTitle: {
        color: "#3D5CFF",
    },
    description: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 12,
        alignItems: "center",
    },
    timeText: {
        fontSize: 12,
        color: "#999",
    },
});

export default UpcomingCourseContainer;

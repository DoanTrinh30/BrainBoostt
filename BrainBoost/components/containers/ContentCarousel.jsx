import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { CARD_WIDTH } from "../../constants/sizes";

const ContentCarousel = ({ 
    items, 
    type = 'deck', // 'deck', 'class', or 'folder'
    selectedIndex, 
    onScroll, 
    onPressItem 
}) => {
    const getIcon = (item) => {
        switch (type) {
            case 'deck':
                return item.visibility === "private" ? "lock" : "earth";
            case 'class':
                return "account-group";
            case 'folder':
                return "folder";
            default:
                return "notebook";
        }
    };

    const getSubtitle = (item) => {
        switch (type) {
            case 'class':
            case 'folder':
                return `${item.studentQuantity} students`;
            case 'deck':
                return item.description;
            default:
                return '';
        }
    };

    const getCardStyle = (isActive) => {
        const baseStyle = [styles.cardContainer];
        if (isActive) baseStyle.push(styles.activeCard);

        switch (type) {
            case 'deck':
                baseStyle.push(styles.deckCard);
                if (isActive) baseStyle.push(styles.activeDeckCard);
                break;
            case 'class':
                baseStyle.push(styles.classCard);
                if (isActive) baseStyle.push(styles.activeClassCard);
                break;
            case 'folder':
                baseStyle.push(styles.folderCard);
                if (isActive) baseStyle.push(styles.activeFolderCard);
                break;
        }

        return baseStyle;
    };

    const getContentIcon = () => {
        switch (type) {
            case 'deck':
                return "cards-outline";
            case 'class':
                return "school-outline";
            case 'folder':
                return "folder-multiple-outline";
            default:
                return "notebook-outline";
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={[
                styles.scrollContainer,
            ]}
        >
            {items.map((item, index) => {
                const isActive = index === selectedIndex;
                const lastUpdated = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true });

                return (
                    <TouchableOpacity
                        key={item.id}
                        style={getCardStyle(isActive)}
                        activeOpacity={0.8}
                        onPress={() => onPressItem(item)}
                    >
                        <View style={styles.header}>
                            <MaterialCommunityIcons
                                name={getIcon(item)}
                                size={20}
                                color={isActive ? "#3D5CFF" : "#666"}
                            />
                            {type === 'deck' && (
                                <Text style={styles.visibilityText}>
                                    {item.visibility === "private" ? "Private" : "Public"}
                                </Text>
                            )}
                        </View>

                        <View style={styles.content}>
                            <View style={[
                                styles.iconContainer,
                                type === 'deck' && styles.deckIconContainer,
                                type === 'class' && styles.classIconContainer,
                                type === 'folder' && styles.folderIconContainer,
                                isActive && styles.activeIconContainer
                            ]}>
                                <MaterialCommunityIcons
                                    name={getContentIcon()}
                                    size={32}
                                    color={isActive ? "#fff" : "#666"}
                                />
                            </View>
                            <Text style={[
                                styles.title,
                                type === 'deck' && styles.deckTitle,
                                type === 'class' && styles.classTitle,
                                type === 'folder' && styles.folderTitle,
                                isActive && styles.activeTitle
                            ]}>
                                {item.name}
                            </Text>
                            <Text style={[
                                styles.subtitle,
                                type === 'deck' && styles.deckSubtitle,
                                type === 'class' && styles.classSubtitle,
                                type === 'folder' && styles.folderSubtitle,
                            ]} numberOfLines={2}>
                                {getSubtitle(item)}
                            </Text>
                        </View>

                        <View style={[
                            styles.footer,
                            type === 'deck' && styles.deckFooter,
                            type === 'class' && styles.classFooter,
                            type === 'folder' && styles.folderFooter,
                        ]}>
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
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 20,
        paddingBottom: 30,
    },
    cardContainer: {
        width: CARD_WIDTH,
        marginRight: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
    },
    activeCard: {
        shadowOpacity: 0.2,
        transform: [{ scale: 1.02 }],
    },
    // Deck specific styles
    deckCard: {
        backgroundColor: "#F8F9FF",
        borderColor: "#E0E5FF",
    },
    activeDeckCard: {
        backgroundColor: "#EDF0FF",
        borderColor: "#3D5CFF",
    },
    deckIconContainer: {
        backgroundColor: "#E0E5FF",
        padding: 16,
        borderRadius: 16,
    },
    deckTitle: {
        color: "#3D5CFF",
    },
    deckSubtitle: {
        color: "#666",
    },
    deckFooter: {
        borderTopColor: "#E0E5FF",
    },
    // Class specific styles
    classCard: {
        backgroundColor: "#FFF9F0",
        borderColor: "#FFE0B2",
    },
    activeClassCard: {
        backgroundColor: "#FFF3E0",
        borderColor: "#FFB74D",
    },
    classIconContainer: {
        backgroundColor: "#FFB74D",
        padding: 16,
        borderRadius: 16,
    },
    classTitle: {
        color: "#F57C00",
    },
    classSubtitle: {
        color: "#666",
    },
    classFooter: {
        borderTopColor: "#FFE0B2",
    },
    // Folder specific styles
    folderCard: {
        backgroundColor: "#F0F7FF",
        borderColor: "#BBDEFB",
    },
    activeFolderCard: {
        backgroundColor: "#E3F2FD",
        borderColor: "#64B5F6",
    },
    folderIconContainer: {
        backgroundColor: "#64B5F6",
        padding: 16,
        borderRadius: 16,
    },
    folderTitle: {
        color: "#1976D2",
    },
    folderSubtitle: {
        color: "#666",
    },
    folderFooter: {
        borderTopColor: "#BBDEFB",
    },
    // Active states
    activeIconContainer: {
        transform: [{ scale: 1.1 }],
    },
    activeTitle: {
        fontWeight: "700",
    },
    // Common styles
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
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
    iconContainer: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
    footer: {
        borderTopWidth: 1,
        paddingTop: 12,
        alignItems: "center",
    },
    timeText: {
        fontSize: 12,
        color: "#999",
    },
});

export default ContentCarousel; 
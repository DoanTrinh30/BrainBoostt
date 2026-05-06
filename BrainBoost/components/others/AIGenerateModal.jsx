import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
    ScrollView,
    Animated,
    ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const LEVELS = [
    { id: 'beginner', label: 'Beginner', icon: 'school-outline' },
    { id: 'intermediate', label: 'Intermediate', icon: 'book-outline' },
    { id: 'advanced', label: 'Advanced', icon: 'ribbon-outline' },
]

const QUANTITY_OPTIONS = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
]

const AIGenerateModal = ({
    visible,
    onClose,
    onGenerate,
    isLoading,
    topic,
    setTopic,
}) => {
    const [level, setLevel] = useState('beginner')
    const [quantity, setQuantity] = useState(10)
    const scaleAnim = React.useRef(new Animated.Value(0.7)).current
    const opacityAnim = React.useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start()
        } else {
            setTopic('')
            setLevel('beginner')
            setQuantity(10)
        }
    }, [visible])

    const handleGenerate = () => {
        if (!topic.trim()) {
            return
        }

        onGenerate({
            topic,
            level,
            quantity,
        })
    }

    const handleBackdropPress = () => {
        Keyboard.dismiss()
        onClose()
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    opacity: opacityAnim,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            {/* Modal Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>
                                    Generate Flashcards with AI
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.modalContent}>
                                {/* Topic Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Topic</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter a topic (e.g. Capitals of Europe)"
                                            value={topic}
                                            onChangeText={setTopic}
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                </View>

                                {/* Level Selection */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Level</Text>
                                    <View style={styles.levelContainer}>
                                        {LEVELS.map((item) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[
                                                    styles.levelOption,
                                                    level === item.id &&
                                                        styles.levelOptionSelected,
                                                ]}
                                                onPress={() =>
                                                    setLevel(item.id)
                                                }
                                            >
                                                <Ionicons
                                                    name={item.icon}
                                                    size={20}
                                                    color={
                                                        level === item.id
                                                            ? '#3D5CFF'
                                                            : '#666'
                                                    }
                                                />
                                                <Text
                                                    style={[
                                                        styles.levelText,
                                                        level === item.id &&
                                                            styles.levelTextSelected,
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Quantity Selection */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>
                                        Number of Flashcards
                                    </Text>
                                    <View style={styles.quantityContainer}>
                                        {QUANTITY_OPTIONS.map((item) => (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={[
                                                    styles.quantityOption,
                                                    quantity === item.value &&
                                                        styles.quantityOptionSelected,
                                                ]}
                                                onPress={() =>
                                                    setQuantity(item.value)
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.quantityText,
                                                        quantity ===
                                                            item.value &&
                                                            styles.quantityTextSelected,
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={styles.generateButton}
                                    onPress={handleGenerate}
                                    disabled={isLoading || !topic.trim()}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                        />
                                    ) : (
                                        <>
                                            <Ionicons
                                                name="flash-outline"
                                                size={20}
                                                color="#fff"
                                            />
                                            <Text
                                                style={
                                                    styles.generateButtonText
                                                }
                                            >
                                                Generate
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    modalContent: {
        padding: 20,
        maxHeight: 500,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    inputContainer: {
        backgroundColor: '#F8F9FD',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E5FF',
    },
    input: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    levelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E5FF',
        borderRadius: 12,
        marginHorizontal: 4,
        backgroundColor: '#F8F9FD',
    },
    levelOptionSelected: {
        backgroundColor: '#EBF3FF',
        borderColor: '#3D5CFF',
    },
    levelText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#666',
        marginLeft: 5,
    },
    levelTextSelected: {
        color: '#3D5CFF',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quantityOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E5FF',
        borderRadius: 12,
        marginHorizontal: 4,
        backgroundColor: '#F8F9FD',
    },
    quantityOptionSelected: {
        backgroundColor: '#EBF3FF',
        borderColor: '#3D5CFF',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    quantityTextSelected: {
        color: '#3D5CFF',
    },
    generateButton: {
        backgroundColor: '#3D5CFF',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    generateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
})

export default AIGenerateModal

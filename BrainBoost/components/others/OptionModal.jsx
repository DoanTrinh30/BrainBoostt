import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRef, useEffect } from 'react'

const { height } = Dimensions.get('window')

export default function OptionModal({
    options,
    modalVisible,
    setModalVisible,
    headerText,
    handleCloseModal,
}) {
    const slideAnim = useRef(new Animated.Value(height)).current

    useEffect(() => {
        if (modalVisible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }
    }, [modalVisible])

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalView,
                            { transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandleBar} />
                            <Text style={styles.modalTitle}>{headerText}</Text>
                        </View>

                        {options?.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    option.disabled && styles.disabledOption,
                                ]}
                                onPress={option.onPress}
                                disabled={option.disabled}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.optionIconContainer,
                                        option.disabled &&
                                            styles.disabledIconContainer,
                                    ]}
                                >
                                    <Ionicons
                                        name={option.icon}
                                        size={28}
                                        color={
                                            option.disabled
                                                ? '#A0A0A0'
                                                : '#3D5CFF'
                                        }
                                    />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <View style={styles.optionTextInner}>
                                        <Text
                                            style={[
                                                styles.optionText,
                                                option.disabled &&
                                                    styles.disabledText,
                                            ]}
                                        >
                                            {option.text}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.optionDescription,
                                                option.disabled &&
                                                    styles.disabledDescription,
                                            ]}
                                        >
                                            {option.description}
                                        </Text>
                                    </View>

                                    {option.tag && (
                                        <View
                                            style={[
                                                styles.optionTagContainer,
                                                option.tag === 'Popular'
                                                    ? styles.popularTag
                                                    : styles.comingSoonTag,
                                            ]}
                                        >
                                            {option.tag === 'Popular' ? (
                                                <Ionicons
                                                    name="star"
                                                    size={12}
                                                    color="#3D5CFF"
                                                    style={styles.tagIcon}
                                                />
                                            ) : null}
                                            <Text
                                                style={[
                                                    styles.optionTagText,
                                                    option.tag ===
                                                        'Coming soon' &&
                                                        styles.comingSoonText,
                                                ]}
                                            >
                                                {option.tag}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        paddingBottom: 40,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 25,
    },
    modalHandleBar: {
        width: 50,
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 18,
        marginBottom: 16,
        backgroundColor: '#F0F4FF',
        elevation: 1,
        shadowColor: '#8E9FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    disabledOption: {
        backgroundColor: '#F5F5F7',
    },
    optionIconContainer: {
        width: 54,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0E8FF',
        borderRadius: 16,
        marginRight: 18,
    },
    disabledIconContainer: {
        backgroundColor: '#E9E9EB',
    },
    optionTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionTextInner: {
        flex: 1,
        paddingRight: 10,
    },
    optionText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 5,
    },
    disabledText: {
        color: '#666',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
    disabledDescription: {
        color: '#999',
    },
    optionTagContainer: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    popularTag: {
        backgroundColor: '#EEF1FF',
    },
    comingSoonTag: {
        backgroundColor: '#EEEEEE',
    },
    tagIcon: {
        marginRight: 4,
    },
    optionTagText: {
        fontSize: 12,
        color: '#3D5CFF',
        fontWeight: '600',
    },
    comingSoonText: {
        color: '#777',
    },
})

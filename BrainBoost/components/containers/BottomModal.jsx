import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'

const BottomModal = ({ isVisible, onClose, onAddDeck }) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ justifyContent: 'flex-end', margin: 0 }}
    >
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalItem}>
                <Text style={styles.modalText}>Invite Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={onAddDeck}>
                <Text style={styles.modalText}>Add Decks</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.modalItem}>
                <Text style={[styles.modalText, { color: '#999' }]}>
                    Cancel
                </Text>
            </TouchableOpacity>
        </View>
    </Modal>
)

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalText: {
        fontSize: 16,
        color: '#000',
    },
})

export default BottomModal

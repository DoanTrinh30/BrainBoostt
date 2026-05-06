import React from 'react'
import { Text, StyleSheet } from 'react-native'

const MembersList = () => (
    <Text style={styles.memberText}>Members list will appear here.</Text>
)

const styles = StyleSheet.create({
    memberText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
})

export default MembersList

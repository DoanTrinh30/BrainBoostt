import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

export default function InviteFriends() {
    return (
        <View style={styles.inviteContainer}>
            <View style={{ flex: 0.5, alignItems: 'center' }}>
                <Image
                    style={styles.imageInvite}
                    source={require('../../assets/images/invite.png')}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.inviteHeaderContainer}>
                <Text style={styles.inviteTitle}>Mời bạn bè</Text>
                <Text style={styles.inviteSubtitle}>
                    Học cùng bạn bè trên BrainBoost — miễn phí và vui!
                </Text>
                <TouchableOpacity style={styles.inviteButton}>
                    <Text style={styles.inviteButtonText}>Mời ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inviteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 30,
        padding: 20,
        backgroundColor: '#003d65',
        borderRadius: 10,
    },
    imageInvite: { width: 100, height: 100, resizeMode: 'contain' },
    inviteHeaderContainer: { flex: 1, alignItems: 'center' },
    inviteTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    inviteSubtitle: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
        textAlign: 'center',
    },
    inviteButton: {
        marginTop: 15,
        backgroundColor: '#049cff',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    inviteButtonText: {
        fontSize: 15,
        color: '#fff',
        paddingHorizontal: 5,
    },
})
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const HomeHeader = ({ userData }) => {
    const router = useRouter()

    const avatarUri =
        userData?.avatar_url ||
        'https://ui-avatars.com/api/?name=' +
            encodeURIComponent(userData?.name || 'User') +
            '&background=3D5CFF&color=fff'

    const displayName = userData?.name || 'bạn'

    return (
        <View style={styles.headerContainer}>
            {/* Search and Profile Row */}
            <View style={styles.topRow}>
                <TouchableOpacity
                    onPress={() => router.push('/search/searchpage')}
                    style={styles.searchContainer}
                >
                    <Ionicons
                        name="search"
                        size={24}
                        color="#666"
                        style={{ marginLeft: 12 }}
                    />
                    <Text style={styles.searchInput}>Tìm kiếm...</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/bottom/profile')}
                >
                    <Image
                        source={{ uri: avatarUri }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            {/* Greeting Section */}
            <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Xin chào, {displayName}</Text>
                <Text style={styles.subGreeting}>
                    Sẵn sàng nâng cấp vốn từ chưa?
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 600,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 8,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        color: '#666',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#3D5CFF',
        backgroundColor: '#E0E0E0',
    },
    greetingContainer: {},
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1F36',
        marginBottom: 8,
    },
    subGreeting: {
        fontSize: 16,
        color: '#666',
        letterSpacing: 0.3,
    },
})

export default HomeHeader
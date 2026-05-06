import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import StatItem from '../../components/containers/StatItem'
import { BarChart } from 'react-native-gifted-charts'
import ProgressBar from '../../components/containers/ProgressBar'
import InviteFriends from '../../components/footer/InviteFriends'
import { useQuery } from '@tanstack/react-query'
import { getProfile, getQuote } from '../../services/profileService'
import { getAllDecks } from '../../services/deckService'
import { getTotalFolders } from '../../services/folderService'
import { getTotalFlashcards } from '../../services/flashcardService'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen() {
    const router = useRouter()

    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getProfile,
    })

    const {
        data: decksData,
        isLoading: isDecksLoading,
        isError: isDecksError,
        error: decksError,
    } = useQuery({
        queryKey: ['decks'],
        queryFn: getAllDecks,
    })

    const {
        data: totalFolderData,
        isLoading: isTotalFolderLoading,
        isError: isTotalFolderError,
        error: totalFolderError,
    } = useQuery({
        queryKey: ['totalfolders'],
        queryFn: getTotalFolders,
    })

    const {
        data: totalFlashcardData,
        isLoading: isTotalFlashcardLoading,
        isError: isTotalFlashcardError,
        error: totalFlashcardError,
    } = useQuery({
        queryKey: ['totalflashcards'],
        queryFn: getTotalFlashcards,
    })

    const {
        data: quoteData,
        isLoading: isQuoteLoading,
        isError: isQuoteError,
        error: quoteError,
    } = useQuery({
        queryKey: ['quote'],
        queryFn: getQuote,
    })

    const isLoading =
        isUserLoading ||
        isDecksLoading ||
        isTotalFolderLoading ||
        isTotalFlashcardLoading ||
        isQuoteLoading

    const error =
        userError ||
        decksError ||
        totalFolderError ||
        isTotalFlashcardError ||
        quoteError

    const deckCount = decksData?.decks?.length || 0

    const folderCount = totalFolderData?.folderCount || 0

    const flashcardCount = totalFlashcardData?.flashcardCount || 0

    const userData = {
        role: 'UX/UX Designer',
        hoursSpent: '14h 9m',
        progress: {
            total: 161,
            activity: 40,
            completed: 60,
            upcoming: 61,
        },
        courses: {
            inProgress: 7,
            completed: 10,
            upcoming: 12,
        },
    }

    const barData = [
        { value: 6.5, label: 'Sun' },
        { value: 4.3, label: 'Mon', frontColor: '#177AD5' },
        { value: 6, label: 'Tue', frontColor: '#177AD5' },
        { value: 8, label: 'Web' },
        { value: 9.3, label: 'Thu', frontColor: '#177AD5' },
        { value: 7.2, label: 'Fri' },
        { value: 6.4, label: 'Sat' },
    ]

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </SafeAreaView>
        )
    }

    if (
        isUserError ||
        isDecksError ||
        isTotalFolderError ||
        isTotalFlashcardError
    ) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>
                        Error:{' '}
                        {error?.message ||
                            'Failed to fetch data. Please try again.'}
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text>No user data available</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/user/setting')}
                    >
                        <Ionicons name="settings" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* User Info */}
                <View style={styles.userInfoContainer}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: user.avatar_url }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userRole}>{user.email}</Text>
                </View>

                {/* Quote */}
                <View style={styles.steveJobsContainer}>
                    <Text style={styles.quoteText}>{quoteData[0]?.q}</Text>
                    <Text style={styles.authorText}>{quoteData[0]?.a}</Text>
                </View>

                {/* Activity Section */}
                <View style={styles.activityContainer}>
                    <View style={styles.activityHeaderContainer}>
                        <Text style={styles.sectionTitle}>Activity</Text>
                        <TouchableOpacity style={styles.dropdown}>
                            <Text style={styles.dropdownText}>Weekly</Text>
                            <Icon name="chevron-down" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hoursContainer}>
                        <Text style={styles.hoursText}>
                            {userData.hoursSpent}
                        </Text>
                        <Text style={styles.hoursLabel}>Hours Spents</Text>
                    </View>
                    {/* Bar Chart */}
                    <View style={styles.chartContainer}>
                        <BarChart
                            barWidth={18}
                            noOfSections={4}
                            barBorderRadius={6}
                            frontColor="lightgray"
                            yAxisThickness={0}
                            xAxisThickness={0}
                            spacing={20}
                            isAnimated
                            data={barData}
                        />
                    </View>
                </View>

                {/* Progress Statistics */}
                <View style={styles.progressContainer}>
                    <Text style={styles.sectionTitle}>Progress statistics</Text>
                    {/* Course Stats */}
                    <View style={styles.courseStatsContainer}>
                        <StatItem
                            iconName="folder"
                            iconColor="#34C759"
                            number={folderCount}
                            label="Folders"
                        />
                        <StatItem
                            iconName="credit-card"
                            iconColor="#007AFF"
                            number={deckCount}
                            label="Decks"
                        />
                        <StatItem
                            iconName="documents"
                            iconColor="#FF9500"
                            number={flashcardCount}
                            label="Flashcards"
                        />
                    </View>
                </View>

                {/* Invite Friends Section */}
                <InviteFriends />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    avatarContainer: {
        position: 'relative',
        width: 100,
        height: 100,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        borderWidth: 3,
        borderColor: '#febc82',
    },

    editAvtButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2e2e2e',
        width: 24,
        height: 24,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },

    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#09a1fe',
    },
    userRole: {
        fontSize: 16,
        color: '#A0A0A0',
        marginTop: 5,
    },
    steveJobsContainer: {
        marginHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    quoteText: {
        fontSize: 16,
        color: '#002950',
        marginTop: 12,
        marginHorizontal: 12,
        textAlign: 'center',
        fontWeight: '600',
    },
    authorText: {
        fontSize: 15,
        color: '#757575',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 12,
        fontWeight: '600',
    },

    activityContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    activityHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 14,
        marginRight: 10,
    },
    hoursContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    hoursText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#002357',
    },
    hoursLabel: {
        fontSize: 16,
        paddingHorizontal: 16,
        color: '#002357',
    },

    chartContainer: {
        marginTop: 10,
        padding: 5,
    },
    progressContainer: {
        marginHorizontal: 20,
        marginTop: 30,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    progressTotal: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    progressLabel: {
        fontSize: 16,
        color: '#A0A0A0',
    },

    courseStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingVertical: 5,
    },
})

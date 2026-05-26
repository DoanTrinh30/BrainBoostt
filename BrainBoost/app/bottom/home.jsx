import React, { useCallback, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { PieChart } from 'react-native-chart-kit'
import { SubmitButton, PieLegend, ContentCarousel } from '../../components'
import { AIGenerateModal } from '../../components/others'
import HomeHeader from '../../components/headers/HomeHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import { generateDeckWithAI, getHomeData } from '../../services/homeService'
import { ITEM_WIDTH } from '../../constants/sizes'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    getRecommendations,
    getReviewStats,
} from '../../services/reviewLogService'
import MLRecommendBanner from '../../components/containers/MLRecommendBanner'
import { getProfile } from '../../services/profileService'

export default function HomeScreen() {
    const router = useRouter()
    const [selectedDeckIndex, setSelectedDeckIndex] = useState(0)
    const [selectedClassIndex, setSelectedClassIndex] = useState(0)
    const [selectedFolderIndex, setSelectedFolderIndex] = useState(0)
    const [topic, setTopic] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const accessToken = useSelector((state) => state.auth.accessToken)

    const {
        data: homeData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['homeData'],
        queryFn: getHomeData,
        enabled: !!accessToken,
    })

    const { data: userProfile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getProfile,
        enabled: !!accessToken,
    })

    const { data: recommendData, isLoading: isLoadingRecommend } = useQuery({
        queryKey: ['mlRecommendations'],
        queryFn: () => getRecommendations(5),
        enabled: !!accessToken,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
    })

    const { data: reviewStats } = useQuery({
        queryKey: ['reviewStats'],
        queryFn: getReviewStats,
        enabled: !!accessToken,
        staleTime: 30 * 1000,
    })

    const generateDeckMutation = useMutation({
        mutationFn: generateDeckWithAI,
        onSuccess: (data) => {
            setIsModalVisible(false)
            router.push({
                pathname: '/decks/adddeck',
                params: {
                    title: topic || 'Bộ thẻ tạo bằng AI',
                    description:
                        data.description || 'Bộ thẻ được tạo tự động bằng AI',
                    flashcards: JSON.stringify(data.flashcards),
                },
            })
        },
        onError: (error) => {
            console.error('Error generating deck:', error)
        },
    })

    const navigateToDeckDetail = useCallback(
        (deck) => {
            router.push({
                pathname: '/decks/deckdetail',
                params: { id: deck.id },
            })
        },
        [router],
    )

    const navigateToClassDetail = useCallback(
        () => router.push('/decks/classdetail'),
        [router],
    )

    const navigateToFolderDetail = useCallback(
        () => router.push('/folderdetail'),
        [router],
    )

    const handleClickGenerateDeck = useCallback(() => {
        setIsModalVisible(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false)
    }, [])

    const handleGenerateWithParams = useCallback((params) => {
        generateDeckMutation.mutate(params)
    }, [])

    const handleStartMLReview = useCallback(() => {
        if (!recommendData?.recommendations?.length) return

        const flashcardsToReview = recommendData.recommendations
            .filter((r) => r.flashcard)
            .map((r) => ({
                id: r.flashcard.id,
                frontText: r.flashcard.frontText,
                backText: r.flashcard.backText,
                imageUrl: r.flashcard.imageUrl,
                _mlRetention: r.retentionProbability,
            }))

        if (flashcardsToReview.length === 0) return

        router.push({
            pathname: '/learning/flashcard',
            params: {
                flashcards: JSON.stringify(flashcardsToReview),
                deckName: '🧠 AI gợi ý ôn tập',
                deckId: '',
            },
        })
    }, [recommendData, router])

    if (isLoading)
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )

    if (isError)
        return (
            <View style={styles.loadingContainer}>
                <Text>Lỗi: {error.message}</Text>
                <Text>Hãy thử tải lại trang</Text>
            </View>
        )

    const safeHomeData = homeData || { decks: [], classes: [], folders: [] }

    const userData = {
        name: userProfile?.username || 'bạn',
        avatar_url: userProfile?.avatar_url,
    }

    const totalReviews = reviewStats?.totalReviews || 0
    const accuracy = reviewStats?.accuracy || 0
    const accuracyPercent = Math.round(accuracy * 100)
    const needToLearnPercent = 100 - accuracyPercent
    const hasReviewData = totalReviews > 0

    const progressData = hasReviewData
        ? [
              {
                  name: 'Đã nhớ tốt',
                  percentage: accuracyPercent,
                  color: '#A5D8FF',
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12,
              },
              {
                  name: 'Cần ôn lại',
                  percentage: needToLearnPercent,
                  color: '#FDAF75',
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12,
              },
          ]
        : []

    const handleScroll = (event, setIndex) => {
        const offsetX = event.nativeEvent.contentOffset.x
        const index = Math.round(offsetX / ITEM_WIDTH)
        setIndex(index)
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <HomeHeader
                    userData={userData}
                    stats={{
                        decks: safeHomeData.decks?.length || 0,
                        classes: safeHomeData.classes?.length || 0,
                        folders: safeHomeData.folders?.length || 0,
                    }}
                />

                <MLRecommendBanner
                    recommendations={recommendData?.recommendations || []}
                    isLoading={isLoadingRecommend}
                    onPress={handleStartMLReview}
                />

                <View style={styles.content}>
                    <SubmitButton
                        isLoading={generateDeckMutation.isPending}
                        text="✨ Tạo thẻ mới với AI ✨"
                        style={styles.buttonShadow}
                        onPress={handleClickGenerateDeck}
                        textStyle={{ fontSize: 17 }}
                    />

                    <Text style={styles.sectionTitle}>Bộ thẻ của bạn</Text>
                    <ContentCarousel
                        items={safeHomeData.decks || []}
                        type="deck"
                        selectedIndex={selectedDeckIndex}
                        onScroll={(event) =>
                            handleScroll(event, setSelectedDeckIndex)
                        }
                        onPressItem={navigateToDeckDetail}
                    />

                    <Text style={styles.sectionTitle}>Lớp học của bạn</Text>
                    <ContentCarousel
                        items={safeHomeData.classes || []}
                        type="class"
                        selectedIndex={selectedClassIndex}
                        onScroll={(event) =>
                            handleScroll(event, setSelectedClassIndex)
                        }
                        onPressItem={navigateToClassDetail}
                    />

                    <Text style={styles.sectionTitle}>Thư mục của bạn</Text>
                    <ContentCarousel
                        items={safeHomeData.folders || []}
                        type="folder"
                        selectedIndex={selectedFolderIndex}
                        onScroll={(event) =>
                            handleScroll(event, setSelectedFolderIndex)
                        }
                        onPressItem={navigateToFolderDetail}
                    />

                    <Text style={styles.sectionTitle}>Biểu đồ tiến độ</Text>
                    {hasReviewData ? (
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={progressData.map((item) => ({
                                    name: item.name,
                                    population: item.percentage,
                                    color: item.color,
                                    legendFontColor: item.legendFontColor,
                                    legendFontSize: item.legendFontSize,
                                }))}
                                width={170}
                                height={170}
                                chartConfig={{
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    color: (opacity = 1) =>
                                        `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) =>
                                        `rgba(0, 0, 0, ${opacity})`,
                                    decimalPlaces: 0,
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                paddingLeft="50"
                                absolute
                                style={{ alignSelf: 'center' }}
                                hasLegend={false}
                            />
                            <View style={styles.legendWrapper}>
                                <PieLegend data={progressData} />
                                <Text style={styles.chartFooter}>
                                    📊 Dựa trên {totalReviews} lượt ôn (AI)
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyChartContainer}>
                            <Text style={styles.emptyChartTitle}>
                                📚 Chưa có dữ liệu học
                            </Text>
                            <Text style={styles.emptyChartText}>
                                Hãy bắt đầu học flashcards để AI phân tích tiến
                                độ của bạn!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <AIGenerateModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onGenerate={handleGenerateWithParams}
                isLoading={generateDeckMutation.isPending}
                topic={topic}
                setTopic={setTopic}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { backgroundColor: '#fff', paddingHorizontal: 15 },
    content: { paddingTop: 20 },
    buttonShadow: {
        marginBottom: 25,
        backgroundColor: '#3D5CFF',
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1F36',
        marginTop: 10,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 130,
        paddingHorizontal: 20,
    },
    legendWrapper: { flex: 1, marginLeft: 10 },
    chartFooter: {
        marginTop: 10,
        fontSize: 11,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    emptyChartContainer: {
        marginHorizontal: 20,
        marginBottom: 130,
        padding: 24,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyChartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1F36',
        marginBottom: 6,
    },
    emptyChartText: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
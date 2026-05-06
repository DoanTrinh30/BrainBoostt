import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import Swiper from 'react-native-deck-swiper'
import Carousel from 'react-native-reanimated-carousel'
import FlipCard from 'react-native-flip-card'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')
const itemWidth = width * 0.9

const FlashcardFlipCarousel = ({
    data,
    showIcon = false,
    onIconPress,
    cardWidth = itemWidth,
    cardHeight = 220,
    mode = 'carousel',
    onSwipe,
    onSwipedAll,
}) => {
    const renderFlashcard = (item) => (
        <FlipCard
            style={[styles.card, { width: cardWidth, height: cardHeight }]}
            friction={6}
            perspective={1000}
        >
            {/* Front Face */}
            <View
                style={[styles.face, { width: cardWidth, height: cardHeight }]}
            >
                <Text style={styles.cardText}>{item.frontText}</Text>
                {showIcon && (
                    <TouchableOpacity
                        style={styles.cornerIcon}
                        onPress={() => onIconPress?.(item)}
                    >
                        <Ionicons
                            name="expand-outline"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Back Face */}
            <View
                style={[styles.back, { width: cardWidth, height: cardHeight }]}
            >
                <Text style={styles.cardText}>{item.backText}</Text>
                {showIcon && (
                    <TouchableOpacity
                        style={styles.cornerIcon}
                        onPress={() => onIconPress?.(item)}
                    >
                        <Ionicons
                            name="expand-outline"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </FlipCard>
    )

    return (
        <View
            style={
                mode === 'carousel'
                    ? styles.carouselContainer
                    : styles.swiperContainer
            }
        >
            {mode === 'carousel' ? (
                <Carousel
                    width={cardWidth}
                    height={cardHeight}
                    data={data}
                    loop
                    autoPlay={false}
                    scrollAnimationDuration={1000}
                    pagingEnabled={true}
                    mode="parallax"
                    style={{ alignSelf: 'center' }}
                    renderItem={({ item }) => renderFlashcard(item)}
                />
            ) : (
                <Swiper
                    cards={data}
                    renderCard={(item) => renderFlashcard(item)}
                    onSwipedLeft={(cardIndex) =>
                        onSwipe(data[cardIndex], 'left')
                    }
                    onSwipedRight={(cardIndex) =>
                        onSwipe(data[cardIndex], 'right')
                    }
                    onSwipedAll={onSwipedAll}
                    verticalSwipe={false}
                    cardIndex={0}
                    backgroundColor={'transparent'}
                    stackSeparation={15}
                    stackSize={3}
                    overlayLabels={{
                        left: {
                            title: "Didn't Know",
                            style: {
                                label: {
                                    backgroundColor: '#FFA500',
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    padding: 10,
                                    borderRadius: 8,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 20,
                                    marginLeft: -20,
                                },
                            },
                        },
                        right: {
                            title: 'Knew It!',
                            style: {
                                label: {
                                    backgroundColor: '#33D9A6',
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    padding: 10,
                                    borderRadius: 8,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 20,
                                    marginLeft: 20,
                                },
                            },
                        },
                    }}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    swipeBackCard
                    containerStyle={styles.swiperContainerStyle}
                    cardStyle={{
                        top: 0,
                        left: 30,
                        width: cardWidth,
                        height: cardHeight,
                    }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    swiperContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        height: height * 0.6,
    },
    swiperContainerStyle: {
        backgroundColor: 'transparent',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height * 0.6,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    face: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 30,
    },
    back: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    cardText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        lineHeight: 32,
    },
    cornerIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
})

export default FlashcardFlipCarousel

import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -80;

const PairInput = ({ 
  id, 
  term, 
  definition, 
  onChangeText, 
  onDelete,
  placeholderTerm = "Term",
  placeholderDefinition = "Definition",
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === 5) {
      // End of gesture
      const { translationX } = event.nativeEvent;
      
      if (translationX < SWIPE_THRESHOLD) {
        // Swiped left far enough, show delete button
        Animated.spring(translateX, {
          toValue: -100,
          useNativeDriver: true,
        }).start();
      } else {
        // Reset position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            { transform: [{ translateX }] }
          ]}
        >
          <View style={styles.flashcardPair}>
            <TextInput
              style={styles.flashcardInput}
              placeholder={placeholderTerm}
              value={term}
              onChangeText={(text) => onChangeText(id, 'term', text)}
            />
            <View style={styles.separator} />
            <TextInput
              style={styles.flashcardInput}
              placeholder={placeholderDefinition}
              value={definition}
              onChangeText={(text) => onChangeText(id, 'definition', text)}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
      
      {/* Delete button that appears when swiped */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
          onDelete(id);
          resetPosition();
        }}
      >
        <Text>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  animatedContainer: {
    width: '100%',
    zIndex: 1,
  },
  flashcardPair: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  flashcardInput: {
    fontSize: 16,
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#FF6B6B',
    height: '100%',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PairInput;
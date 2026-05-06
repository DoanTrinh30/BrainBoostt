import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuestionHeader = ({ question }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
    </View>
  );
};

export default QuestionHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

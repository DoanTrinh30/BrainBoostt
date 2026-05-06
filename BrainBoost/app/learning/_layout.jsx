import { Stack } from "expo-router";

export default function LearningLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="flashcard" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="test" />
    </Stack>
  );
}
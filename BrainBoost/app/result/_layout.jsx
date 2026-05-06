import { Stack } from "expo-router";

export default function ResultLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="resultlearn" />
      <Stack.Screen name="result_test" />
    </Stack>
  );
}
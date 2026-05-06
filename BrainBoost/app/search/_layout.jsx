import { Stack } from "expo-router";

export default function ResultLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="searchpage" />
    </Stack>
  );
}
import { Stack } from "expo-router";

export default function DecksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="adddeck" />
      <Stack.Screen name="deckdetail" />
      <Stack.Screen name="editdeck" />
    </Stack>
  );
}
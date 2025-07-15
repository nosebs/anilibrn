import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ header: () => (<></>) }} />
    </Stack>
  );
}

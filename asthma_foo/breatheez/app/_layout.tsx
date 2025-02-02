import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext"; // Ensure correct path

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

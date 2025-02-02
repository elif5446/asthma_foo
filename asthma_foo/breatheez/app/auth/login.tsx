import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await login(email, password); // Returns `{ userId, token }`

      if (user && user.userId) {
        console.log("✅ User ID received:", user.userId); // 🔍 Debugging Log
        await AsyncStorage.setItem("userId", user.userId); // Store userId

        router.replace("/tabs/journal"); // Navigate without passing userId
      } else {
        console.error("Login failed: No userId received");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleLogin} />
      <Text style={styles.signupText}>Don't have an account?</Text>
      <Button title="Sign Up" onPress={() => router.push("./register")} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  signupText: { marginTop: 10, textAlign: "center" },
});

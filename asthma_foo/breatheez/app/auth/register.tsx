import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { REACT_NATIVE_BACKEND_URL } from "../../utils/api";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${REACT_NATIVE_BACKEND_URL}/api/auth/register`,
        {
          email,
          password,
        }
      );

      console.log("Registration successful:", response.data);
      alert("Registration successful! Please log in.");
      router.replace("/auth/login");
    } catch (err: unknown) {
      // Fix: Type `error` as `unknown`
      if (axios.isAxiosError(err)) {
        console.error("Registration Error:", err.response?.data || err.message);
        alert(
          `Registration failed: ${
            err.response?.data?.message || "Unknown error"
          }`
        );
      } else {
        console.error("Unexpected Error:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

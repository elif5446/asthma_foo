import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
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
      <Text style={styles.title}>chip</Text>
      <Text style={styles.title1}>Your Breathing Companion</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.image1}
        />
      </View>

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
      <Button title="Register" onPress={handleRegister} color="#FFBF00" />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  imageContainer: {
    backgroundColor: "center",
    flexDirection: "row", // Puts items in a row (side by side)
    alignItems: "center", // Aligns text and image vertically
    justifyContent: "center", // Centers everything horizontally
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  image1: { width: 160, height: 160, resizeMode: "contain", padding: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
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
        console.log("User ID received:", user.userId); // Debugging Log
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
      <Text style={styles.title}>chip</Text>
      <Text style={styles.title1}>Your Breathing Companion</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.image1}
        />
      </View>

      <Text style={styles.title2}>Login</Text>

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
      <Button title="Sign In" onPress={handleLogin} color="#FFBF00" />
      <Text></Text>
      <Text style={styles.signupText}>Don't have an account yet?</Text>

      <Button
        title="Sign Up"
        onPress={() => router.push("./register")}
        color="#FFBF00"
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "System",
  },
  title1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 1.3, // Shadow transparency
    shadowRadius: 8,
    fontFamily: "System",
  },
  signupText: { marginTop: 10, textAlign: "center" },
});

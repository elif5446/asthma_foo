import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import GeminiChat from "@/components/GeminiChat";

const Page = () => {
  return (
    <View style={styles.container}>
      <GeminiChat />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "center",
    alignItems: "center",
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import * as GoogleGenerativeAI from "@google/generative-ai";

// type Message = {
//   text: string;
//   user: boolean;
// };

// const GeminiChat = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [userInput, setUserInput] = useState("");
//   const [inputHeight, setInputHeight] = useState(40);
//   const [loading, setLoading] = useState(false);

//   const GGL_API_KEY = "AIzaSyD4nK92b38N-l8Pt3AtfWf02Gr3Wh6RQig";

//   useEffect(() => {
//     const StartChat = async () => {
//       const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GGL_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       const prompt = "hello";
//       const result = await model.generateContent(prompt);
//       const response = result.response;
//       const text = response.text();
//       console.log(text);

//       setMessages([
//         {
//           text,
//           user: false,
//         },
//       ]);
//     };
//     StartChat();
//   }, []);

//   const renderMessage = ({ item }) => {
//     <View>
//       <Text style={[styles.messagesText, item.user & styles.userMessage]}>
//         {item.text}
//       </Text>
//     </View>;
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => index.text}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={[styles.inputBar, { height: inputHeight }]}
//           placeholder="Type a message to start chatting with Chip!"
//           placeholderTextColor="#36454F"
//           onChangeText={setUserInput}
//           value={userInput}
//           multiline
//         />
//         {loading && <ActivityIndicator size="small" color="black" />}
//       </View>
//     </View>
//   );
// };

// export default GeminiChat;

// const styles = StyleSheet.create({
//   container: {
//     padding: 50,
//   },
//   messagesText: {},
//   text: {},
//   inputContainer: {
//     flex: 1,
//     marginTop: 50,
//     padding: 15,
//   },
//   inputBar: {
//     borderWidth: 1,
//     borderColor: "grey",
//     padding: 10,
//     margin: 10,
//     borderRadius: 15,
//     backgroundColor: "#BDB5D5",
//     width: 380,
//   },
// });
import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";

type Message = {
  text: string;
  user: boolean;
};

const GeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyD4nK92b38N-l8Pt3AtfWf02Gr3Wh6RQig"; // Add your Gemini API key here

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "hello!";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      showMessage({
        message: "Welcome to Gemini Chat 🤖",
        description: text,
        type: "info",
        icon: "info",
        duration: 2000,
      });
      setMessages([
        {
          text,
          user: false,
        },
      ]);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
    setLoading(false);
    setUserInput("");
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.text}
        style={styles.flatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  flatList: { flex: 1, paddingBottom: 10 },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
    color: "#fff",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    color: "#4F4B4B",
  },
  messageText: { fontSize: 16, color: "white" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 10,
    height: 50,
    color: "white",
  },
});

export default GeminiChat;

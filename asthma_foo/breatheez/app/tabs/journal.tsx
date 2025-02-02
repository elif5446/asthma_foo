import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

const REACT_NATIVE_BACKEND_URL = "http://localhost:5050/";

const Page = () => {
  type Entry = {
    id: string;
    userId: string;
    asthmaAttack: string;
    symptoms: string;
    comments: string;
    dateCreated: string;
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [comments, setComments] = useState("");
  const [asthmaAttack, setAsthmaAttack] = useState("");
  const [severity, setSeverity] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  // // ✅ Fetch userId from AsyncStorage and journal entries
  // useEffect(() => {
  //   const fetchUserIdAndEntries = async () => {
  //     try {
  //       const storedUserId = await AsyncStorage.getItem("userId");
  //       if (storedUserId) {
  //         setUserId(storedUserId);
  //         fetchEntries(storedUserId);
  //       } else {
  //         console.error("❌ No userId found in AsyncStorage.");
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching user ID:", error);
  //     }
  //   };

  //   fetchUserIdAndEntries();
  // }, []);

  // Fetch journal entries from backend
  useEffect(() => {
    const fetchUserEntries = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Retrieve user ID

        if (!userId) {
          console.error("No user ID found.");
          return;
        }
        setLoading(true);
        console.log("Fetching journal entries for userId:", userId);

        const response = await axios.get(
          `${REACT_NATIVE_BACKEND_URL}api/journal/${userId}`
        );

        if (!response.data.length) {
          console.log("No journal entries found for this user.");
        }

        // Sort entries by date (assuming date is in a standard format)
        const sortedEntries = response.data.sort(
          (a: Entry, b: Entry) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        );

        setEntries(sortedEntries);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserEntries();
  }, []);

  // Save new journal entry
  const handleSave = async () => {
    if (!asthmaAttack.trim() || !symptoms.trim()) {
      console.error("Required fields missing");
      return;
    }

    try {
      // Retrieve userId from AsyncStorage
      const storedUserId = await AsyncStorage.getItem("userId");

      if (!storedUserId) {
        console.error("No userId found in AsyncStorage.");
        return;
      }

      console.log("Retrieved userId:", storedUserId); // Debugging log

      // Create new entry including userId
      const newEntry: Entry = {
        id: Date.now().toString(),
        userId: storedUserId, // Attach the userId to the entry
        asthmaAttack,
        symptoms,
        comments,
        dateCreated: new Date().toLocaleDateString(),
      };

      // Sending entry to mongoDB
      const requestUrl = `${REACT_NATIVE_BACKEND_URL}api/journal`;
      console.log("Sending journal entry to:", requestUrl);
      console.log("Journal Entry Data:", newEntry);

      const response = await axios.post(requestUrl, newEntry, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Journal entry saved in MongoDB!", response.data);

        // Add entry to local state
        setEntries([newEntry, ...entries]);

        // Reset input fields & close modal
        setAsthmaAttack("");
        setSymptoms("");
        setComments("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error retrieving userId:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Past Journal Entries</Text>
        <Image
          source={require("../../assets/images/news.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Displaying all (past) entries in chronological order (most recent at top-most) */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedEntry(item)}>
            <View style={styles.entryItem}>
              <Text style={styles.entryDate}>
                <Text>Date: </Text>
                {new Date(item.dateCreated).toLocaleDateString()}
              </Text>

              <Text style={styles.entryText}>
                <Text style={styles.entryBold}>Asthma attack: </Text>
                {item.asthmaAttack}{" "}
              </Text>

              <Text style={styles.entryText}>
                <Text style={styles.entryBold}>Symptoms: </Text>
                {item.symptoms}
              </Text>

              <Text style={styles.entryText}>
                <Text style={styles.entryBold}>Additional comments: </Text>
                {item.comments}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal visible={!!selectedEntry} animationType="slide" transparent={true}>
        <View style={styles.modalContainer1}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.headerImage1}
          />
          <View style={styles.modalContent1}>
            {selectedEntry && (
              <>
                <View>
                  <Text style={styles.headerNew1}>
                    Your Journal Entry Details
                  </Text>
                  <Text style={styles.headerNew11}>
                    {selectedEntry.dateCreated}
                  </Text>
                </View>
                <View>
                  <Text style={styles.entryText1}>Asthma Attack</Text>
                  <Text style={styles.entryData}>
                    {" "}
                    {selectedEntry.asthmaAttack}
                  </Text>
                </View>
                <View>
                  <Text style={styles.entryText1}>Your symptoms</Text>
                  <Text style={styles.entryData}>
                    {" "}
                    {selectedEntry.symptoms}
                  </Text>
                </View>
                <View>
                  <Text style={styles.entryText1}>Your comments</Text>
                  <Text style={styles.entryData}>
                    {" "}
                    {selectedEntry.comments}
                  </Text>
                </View>
              </>
            )}
            <Button
              title="Close"
              onPress={() => setSelectedEntry(null)}
              color="#FFBF00"
            />
          </View>
        </View>
      </Modal>

      {/* + Icon to add a new entry */}
      <TouchableOpacity
        style={styles.add}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textAdd}>+</Text>
      </TouchableOpacity>

      {/* Adding an entry - Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Button to remove the entry from view (closes modal) / Entry not saved */}
            <View style={styles.closeButt}>
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
                color="#FFBF00"
              />
            </View>
            <View style={styles.imageContainer}>
              <View>
                <Image
                  source={require("../../assets/images/icon.png")} // wrong path
                  style={styles.image}
                />
              </View>
              <Text style={styles.headerNew}>New Journal Entry</Text>
            </View>

            {/* Box to specify if user had an asthma attack today */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput1}
                placeholder="Did you have an asthma attack today?"
                placeholderTextColor="#36454F"
                value={asthmaAttack}
                onChangeText={setAsthmaAttack}
              />
            </View>

            {/* Box to specify user's symptoms */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput2}
                placeholder="What symptoms did you experience?"
                placeholderTextColor="#36454F"
                value={symptoms}
                onChangeText={setSymptoms}
                multiline={true}
              />
            </View>

            {/* Box for user to write additional comments */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput3}
                placeholder="Any relevant comments? "
                placeholderTextColor="#36454F"
                value={comments}
                onChangeText={setComments}
                multiline={true}
              />
            </View>

            {/* Button to save the new entry */}
            <View style={styles.saveButt}>
              <Button title="Save" onPress={handleSave} color="#FFBF00" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Page;

// "#eab9ff"

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: "center",
    flexDirection: "row", // Puts items in a row (side by side)
    alignItems: "center", // Aligns text and image vertically
    justifyContent: "flex-start", // Centers everything horizontally
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "center",
  },
  image: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  header: {
    textAlign: "center",
    fontSize: 25,
    fontFamily: "System",
    padding: 15,
    fontWeight: "bold",
    margin: 10,
    borderRadius: 10,
  },
  headerImage: {
    width: 40, // Adjust image width
    height: 40, // Adjust image height
    resizeMode: "contain", // Ensures image fits inside box
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, // More rounded corners
    borderWidth: 1, // Adds a light border
    borderColor: "#E0E0E0", // Light gray border for a clean look
  },
  modalContent1: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  entryData: {
    paddingLeft: 20,
    paddingRight: 300,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 3,
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "bold",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    marginBottom: 20,

    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.5, // Shadow transparency
    shadowRadius: 5, // Shadow blur radius
  },
  headerNew1: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
    //backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 15,
  },
  headerNew11: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 70,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,

    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 1, height: 2 }, // Shadow position
    shadowOpacity: 0.9, // Shadow transparency
    shadowRadius: 4, // Shadow blur radius
  },
  headerImage1: {
    marginTop: 120,
    width: 60, // Adjust image width
    height: 60, // Adjust image height
    resizeMode: "contain", // Ensures image fits inside box
    position: "absolute", // Moves the image freely inside the container
    top: 0, // Places the image at the top
    alignSelf: "center", // Ensures it's horizontally centered
  },
  entryDate1: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "System",
    marginLeft: 200,
  },
  entryText1: {
    fontSize: 20,
    fontFamily: "System",
    padding: 3,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  entryItem: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
    borderRadius: 10,
    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 1, height: 2 }, // Shadow position
    shadowOpacity: 1.9, // Shadow transparency
    shadowRadius: 8, // Shadow blur radius
  },
  entryDate: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "System",
    marginLeft: 200,
  },
  entryText: {
    fontSize: 16,
    fontFamily: "System",
    padding: 3,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  entryBold: {
    fontWeight: "bold",
  },
  headerNew: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "center",
    marginTop: 0.5,
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
  },
  add: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFBF00",
  },
  textAdd: {
    fontSize: 50,
    fontFamily: "System",
    lineHeight: 55,
  },
  modalContainer: {},
  modalContent: {},
  textInput1: {
    paddingHorizontal: 10,
    borderWidth: 1,
    width: "90%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginLeft: 20,
    fontSize: 17,
    height: 50,
    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 1, height: 2 }, // Shadow position
    shadowOpacity: 1.9, // Shadow transparency
    shadowRadius: 8, // Shadow blur radius
  },
  textInput2: {
    paddingHorizontal: 10,
    borderWidth: 1,
    width: "90%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginLeft: 20,
    fontSize: 17,
    height: 80,
    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 1, height: 2 }, // Shadow position
    shadowOpacity: 1.9, // Shadow transparency
    shadowRadius: 8, // Shadow blur radius
  },
  textInput3: {
    paddingHorizontal: 10,
    paddingTop: 10,
    borderWidth: 1,
    width: "90%",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginLeft: 20,
    fontSize: 17,
    height: 110,
    textAlignVertical: "top",
    shadowColor: "#BDB5D5", // Shadow color
    shadowOffset: { width: 1, height: 2 }, // Shadow position
    shadowOpacity: 1.9, // Shadow transparency
    shadowRadius: 8, // Shadow blur radius
  },
  inputBox: {
    borderRadius: 20,
  },
  saveButt: {},
  closeButt: {
    marginTop: 50,
    fontFamily: "System",
    fontSize: 20,
    marginLeft: 310,
  },
});

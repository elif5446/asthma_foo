import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

type Location = {
  lat: number;
  lng: number;
};

type SearchBarProps = {
  setSelectedLocation: (location: Location | null) => void;
};

type Prediction = {
  description: string;
  place_id: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ setSelectedLocation }) => {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<Prediction[]>([]);
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);

  const fetchSuggestions = async (text: string) => {
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
          {
            params: {
              input: text,
              key: "AIzaSyBGGz3Nb_ms1-Ucu_6S27e_J4wYunA8bDA",
            },
          }
        );
        setLocations(response.data.predictions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setLocations([]);
    }
  };

  const handleSelectLocation = async (placeId: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            placeid: placeId,
            key: "AIzaSyBGGz3Nb_ms1-Ucu_6S27e_J4wYunA8bDA",
          },
        }
      );
      const { lat, lng } = response.data.result.geometry.location;
      setSelectedLocation({ lat, lng });
      setLocations([]);
      setQuery("");
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchSuggestions(text);
        }}
      />

      {locations.length > 0 && (
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            data={locations}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectLocation(item.place_id)}
                onPressIn={() => setPressedItemId(item.place_id)}
                onPressOut={() => setPressedItemId(null)}
              >
                <View
                  style={[
                    styles.item,
                    pressedItemId === item.place_id && styles.itemPressed,
                  ]}
                >
                  <Text style={styles.itemText}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    zIndex: 1,
    alignItems: "center",
    paddingTop: 1,
  },
  input: {
    height: 55,
    width: "90%",
    borderColor: "gray",
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  listContainer: {
    maxHeight: 300,
    width: "100%",
    marginTop: 5,
  },
  list: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
  },
  itemPressed: {
    backgroundColor: "#e0e0e0",
  },
  itemText: {
    fontSize: 16,
  },
});

export default SearchBar;

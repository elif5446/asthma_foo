import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@/components/BottomSheet";
import MapView, { Marker, Region } from "react-native-maps";
import useLocation from "@/hooks/useLocation";
import SearchBar from "@/components/SearchBar";

type Location = {
  lat: number;
  lng: number;
} | null;

const HomeScreen = () => {
  const { latitude, longitude, errorMsg } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<Location>(null);
  const [searchedLocation, setSearchedLocation] = useState<Location>(null); // State for searched location
  const mapRef = useRef<MapView>(null);

  // Function to animate to new location
  const animateToLocation = (location: { lat: number; lng: number }) => {
    console.log("Animating to location:", location);
    mapRef.current?.animateToRegion(
      {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.922,
        longitudeDelta: 0.421,
      },
      1000
    );
  };

  // Handle location selection from SearchBar
  const handleLocationSelect = (newLocation: Location) => {
    console.log("New location selected:", newLocation);
    setSearchedLocation(newLocation); // Update searched location
    setSelectedLocation(newLocation); // Update selected location for marker
    if (newLocation) {
      animateToLocation(newLocation); // Animate map to the new location
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: latitude || 45.5017,
            longitude: longitude || -73.6893,
            latitudeDelta: 0.922,
            longitudeDelta: 0.421,
          }}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
              }}
            />
          )}
        </MapView>

        {/* SearchBar */}
        <View style={styles.searchContainer}>
          <SearchBar setSelectedLocation={handleLocationSelect} />
        </View>

        {/* BottomSheet */}
        <BottomSheet
          setSelectedLocation={setSelectedLocation}
          searchLocation={searchedLocation} // Pass searched location to BottomSheet
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

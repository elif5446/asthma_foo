import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permission to location was not granted");
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      console.log(latitude, longitude);
      setLatitude(latitude);
      setLongitude(longitude);
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      console.log("USER LOCATION IS", response);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { latitude, longitude, errorMsg };
};

export default useLocation;

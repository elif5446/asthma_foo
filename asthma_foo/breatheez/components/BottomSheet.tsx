import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useLocation from "../hooks/useLocation";
import Slider from "@react-native-community/slider";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import axios from "axios";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 130;

type Location = {
  lat: number;
  lng: number;
} | null;

interface BottomSheetProps {
  setSelectedLocation: (location: Location | null) => void;
  searchLocation: Location | null;
}

const CustomSlider = () => {
  const [value, setValue] = useState(0);

  // Define stop points as an array of objects with value and label
  const stopPoints = [
    { value: 0, label: "Normal" },
    { value: 33.3, label: "Sensitive" },
    { value: 66.6, label: "Asthmatic" },
    { value: 100, label: "Severe Asthma" },
  ];

  // Function to round the value to the nearest stop point
  const snapValue = (value: number) => {
    let closest = stopPoints[0].value;
    let minDifference = Math.abs(value - closest);

    stopPoints.forEach((point) => {
      const difference = Math.abs(value - point.value);
      if (difference < minDifference) {
        closest = point.value;
        minDifference = difference;
      }
    });

    // Round the closest value to one decimal place to avoid floating-point precision issues
    return Math.round(closest * 10) / 10;
  };

  // Find the label for the current value
  const currentLabel =
    stopPoints.find((point) => Math.abs(point.value - value) < 0.1)?.label ||
    "";

  // Function to determine AQI status based on the current value and patient condition
  const getAqiStatus = (value: number, condition: string) => {
    if (condition === "Normal") {
      if (value <= 50) return "Good";
      else if (value <= 95) return "Acceptable";
      else return "Bad";
    } else if (condition === "Sensitive") {
      if (value <= 30) return "Good";
      else if (value <= 70) return "Acceptable";
      else return "Bad";
    } else if (condition === "Asthmatic") {
      if (value <= 20) return "Good";
      else if (value <= 50) return "Acceptable";
      else return "Bad";
    } else if (condition === "Severe Asthma") {
      if (value <= 10) return "Good";
      else if (value <= 30) return "Acceptable";
      else return "Bad";
    }
    return "Unknown";
  };

  // Get the AQI status based on the current value and patient condition
  const aqiStatus = getAqiStatus(value, currentLabel);

  return (
    <View style={styles1.container}>
      <Text style={{ fontWeight: "bold" }}>
        Value: {value} ({currentLabel})
      </Text>
      <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={(val) => setValue(snapValue(val))}
      />
      <View style={styles1.labelsContainer}>
        {stopPoints.map((point, index) => (
          <Text key={index} style={styles1.label}>
            {point.label}
          </Text>
        ))}
      </View>
      {/* Display AQI status */}
      <Text style={styles1.aqiStatus}>AQI Status: {aqiStatus}</Text>
    </View>
  );
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  setSelectedLocation,
  searchLocation,
}) => {
  const { latitude, longitude, errorMsg } = useLocation();
  const [airQualityData, setAirQualityData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchAirQualityData = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const apiKey = "f76c0fbde94e026582f3353293e9049e762174ed";
      const apiUrl = `http://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiKey}`;

      const response = await axios.get(apiUrl);
      setAirQualityData(response.data);
      setLoading(false);
    } catch (err) {
      setApiError("Error fetching air quality data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude && !searchLocation) {
      fetchAirQualityData(latitude, longitude);
    }
  }, [latitude, longitude, searchLocation]);

  useEffect(() => {
    if (searchLocation) {
      fetchAirQualityData(searchLocation.lat, searchLocation.lng);
    }
  }, [searchLocation]);

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        event.translationY + context.value.y,
        MAX_TRANSLATE_Y
      );
      translateY.value = Math.min(translateY.value, 0);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.65) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
      } else if (translateY.value < -SCREEN_HEIGHT / 2) {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  useEffect(() => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
  }, []);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return {
      transform: [{ translateY: translateY.value }],
      borderRadius,
    };
  });
  const stringbruh = "";
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : apiError ? (
          <View>
            <Text>Error: {apiError}</Text>
            <Button
              title="Retry"
              onPress={() =>
                latitude &&
                longitude &&
                fetchAirQualityData(latitude, longitude)
              }
            />
          </View>
        ) : airQualityData ? (
          <View style={styles.info}>
            <Text style={styles.myLocation}>
              {searchLocation ? "Searched Location" : "My Location"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>City: </Text>
              {airQualityData.data.city.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>AQI: </Text>
              {airQualityData.data.aqi}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>PM2.5: </Text>
              {airQualityData.data.iaqi.pm25?.v ?? "N/A"} µg/m³
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>PM10: </Text>
              {airQualityData.data.iaqi.pm10?.v ?? "N/A"} µg/m³
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>CO: </Text>
              {airQualityData.data.iaqi.co?.v ?? "N/A"} ppm
            </Text>
            <CustomSlider />
          </View>
        ) : (
          <Text>No air quality data available.</Text>
        )}
        <View style={styles.addInfo}>
          <Text style={styles.addText}>
            <Text style={styles.boldText}>AQI </Text>stands for{" "}
            <Text style={styles.boldText}>Air Quality Index</Text>, and it
            measures the quality of air and the level of pollution in a
            particular area. As someone who has asthma, you should stay in areas
            with an AQI <Text style={styles.boldText}>below 50</Text>.
          </Text>
          <Text style={styles.addText}>
            <Text style={styles.boldText}>PM2.5 </Text>stands for{" "}
            <Text style={styles.boldText}>
              Particulate Matter with a diameter less than 2.5 µm
            </Text>
            . The safe threshold for you is{" "}
            <Text style={styles.boldText}>less than 25 µg/m³</Text>.
          </Text>
          <Text style={styles.addText}>
            <Text style={styles.boldText}>PM10 </Text>is{" "}
            <Text style={styles.boldText}>
              Particulate Matter with a diameter less than 10 µm
            </Text>
            . The safe quantities for you is
            <Text style={styles.boldText}> less than 100 µg/m³</Text>.
          </Text>
          <Text style={styles.addText}>
            <Text style={styles.boldText}>CO </Text>is for{" "}
            <Text style={styles.boldText}>Carbon Monoxide</Text>. It is
            particularly dangerous, even in very low concentrations, for people
            with asthma, as it worsens breathing difficulties and reduces oxygen
            levels in blood. The safe threshold for you would be
            <Text style={styles.boldText}> under 9 ppm</Text>.
          </Text>
        </View>
        <CustomSlider />
      </Animated.View>
    </GestureDetector>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 5,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  textofLocation: {
    fontFamily: "System",
    fontSize: 15,
  },
  info: {
    padding: 20,
  },
  myLocation: {
    fontWeight: "bold",
    fontSize: 28,
    fontFamily: "System",
    textAlign: "center",
    paddingBottom: 15,
  },
  text: {
    fontSize: 18,
    padding: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  addInfo: {
    padding: 20,
  },
  addText: {
    fontSize: 17,
    padding: 5,
    fontStyle: "italic",
  },
  container: {
    padding: 40,
    alignItems: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
});

const styles1 = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  aqiStatus: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

import React from "react";
import { Tabs } from "expo-router";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import useSliderLogic from "@/hooks/sliderLogic";

export default function TabLayout() {
  const { currentLabel, getAqiStatus } = useSliderLogic();

  // Example AQI value (you can fetch this dynamically or pass it as a prop)
  const currentAqi = 120; // Replace this with your actual AQI value

  // Determine the AQI status ("Good" or "Bad") based on the current stop point
  //const aqiStatus = getAqiStatus(currentAqi);

  // Modify the title to include the AQI status
  //const dynamicTitle = `${currentLabel}`;

  return (
    <Tabs>
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal", // Use the dynamic title here
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: "Data",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="bar-graph" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

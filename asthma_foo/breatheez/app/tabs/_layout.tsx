import React from "react";
import { Tabs } from "expo-router";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFBF00", // ✅ Gold color when selected
        tabBarInactiveTintColor: "gray", // ✅ Gray when not selected
      }}
    >
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
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

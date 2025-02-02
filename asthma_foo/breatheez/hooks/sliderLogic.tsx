import { useState } from "react";

const useSliderLogic = () => {
  const [value, setValue] = useState(0);

  // Define stop points as an array of objects with value, label, and AQI thresholds
  const stopPoints = [
    { value: 0, label: "Normal", aqiThreshold: 50 }, // AQI <= 50 is "Good"
    { value: 33.3, label: "Sensitive", aqiThreshold: 100 }, // AQI <= 100 is "Good"
    { value: 66.6, label: "Asthmatic", aqiThreshold: 150 }, // AQI <= 150 is "Good"
    { value: 100, label: "Severe Asthma", aqiThreshold: 200 }, // AQI <= 200 is "Good"
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

    return closest;
  };

  // Find the label for the current value
  const currentLabel =
    stopPoints.find((point) => point.value === value)?.label || "";

  // Function to determine if the AQI is "Good" or "Bad" based on the current stop point
  const getAqiStatus = (aqi: number) => {
    const currentStopPoint = stopPoints.find((point) => point.value === value);
    if (!currentStopPoint) return "Unknown";

    return aqi <= currentStopPoint.aqiThreshold ? "Good" : "Bad";
  };

  return {
    value,
    setValue,
    stopPoints,
    snapValue,
    currentLabel,
    getAqiStatus, // Add this function to the returned object
  };
};

export default useSliderLogic;

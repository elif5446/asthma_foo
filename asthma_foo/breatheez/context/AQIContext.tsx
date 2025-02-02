import React, { createContext, useState } from "react";

export const AQIContext = createContext();

export const AQIProvider = ({ children }) => {
  const [aqi, setAqi] = useState(null);

  return (
    <AQIContext.Provider value={{ aqi, setAqi }}>
      {children}
    </AQIContext.Provider>
  );
};

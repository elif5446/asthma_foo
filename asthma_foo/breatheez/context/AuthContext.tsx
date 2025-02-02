import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

// Replace this with your actual backend URL
const REACT_NATIVE_BACKEND_URL = "http://localhost:5050";

// Define the authentication context type
interface AuthContextType {
  user: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ userId: string; token: string } | null>;
  logout: () => Promise<void>;
}

// Create the authentication context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode; // Fix TypeScript error on "children"
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
      if (storedUserId && token) {
        setUser(storedUserId);
      }
    };
    loadUser();
  }, []);

  // Function to log in
  const login = async (
    email: string,
    password: string
  ): Promise<{ userId: string; token: string } | null> => {
    try {
      const res = await axios.post(
        `${REACT_NATIVE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );
      if (res.data.userId && res.data.token) {
        await AsyncStorage.setItem("userId", res.data.userId); //  Store userId
        await AsyncStorage.setItem("token", res.data.token); //  Store token

        setUser(res.data.userId); //  Update user state

        return { userId: res.data.userId, token: res.data.token }; //  Return userId & token
      } else {
        return null;
      }
    } catch (error) {
      alert("Login failed. Check credentials.");
      return null;
    }
  };

  // Function to log out
  const logout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React, { createContext, useContext, useState, useEffect } from "react";
import { login, register } from "../api/auth";
import { User } from "../types";
import axios from "../utils/axios";

interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (userData: {
    name: string;
    email: string;
    password: string;
    preferences: string[];
    age: number;
  }) => Promise<void>;
  logout: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const parseJwt = (token: string): any => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // Auto-login on refresh: cek token di localStorage
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = parseJwt(token);
          if (payload && payload.id && payload.email) {
            // Set axios default header untuk semua request selanjutnya
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // Set user state dengan data dari JWT
            setUser({
              id: payload.id,
              name: payload.email,
              email: payload.email,
              preferences: payload.preferences || [],
              age: payload.age || 0,
            });
          } else {
            // Token invalid, hapus dari localStorage
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          localStorage.removeItem("token");
        }
      }
      setAuthLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    const response = await login({ email, password });
    const token = response.token;
    localStorage.setItem("token", token);
    // Set axios default header setelah login
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (response.user) {
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        preferences: response.user.preferences || [],
        age:
          "age" in response.user && typeof response.user.age === "number"
            ? response.user.age
            : 0,
      });
    } else {
      const payload = parseJwt(token);
      setUser({
        id: payload?.id || 0,
        name: payload?.email || email,
        email: payload?.email || email,
        preferences: payload?.preferences || [],
        age: payload?.age || 0,
      });
    }
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    preferences: string[];
    age: number;
  }) => {
    const response = await register(userData);
    if (response.token && response.user) {
      localStorage.setItem("token", response.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.token}`;
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        preferences: response.user.preferences || [],
        age: response.user.age || 0,
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    // Hapus axios default header saat logout
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, registerUser, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

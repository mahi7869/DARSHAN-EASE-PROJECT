import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("darshanease_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const userData = res.data.data;
    localStorage.setItem("darshanease_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    const userData = res.data.data;
    localStorage.setItem("darshanease_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("darshanease_user");
    setUser(null);
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isOrganizer = () => user?.role === "ORGANIZER";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin, isOrganizer }}
    >
      {children}
    </AuthContext.Provider>
  );
};

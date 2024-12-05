import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(localStorage.getItem("userdata") || null);
  const [userId, setUserId] = useState(parseInt(localStorage.getItem("userid")) || null);
  const navigate = useNavigate();

  const saveAccessToken = (token) => {
    localStorage.setItem("access", token);
  };

  const saveRefreshToken = (token) => {
    localStorage.setItem("refresh", token);
  };

  const saveUserData = (data) => {
    localStorage.setItem("userdata", data);
    if (!data.id) {
      console.log("wrong user data");
      return;
    }
    localStorage.setItem("userid", data.id);
    setUserId(parseInt(data.id));
  };

  const onLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUserData(null);
    localStorage.removeItem("userdata");
    setUserId(null);
    localStorage.removeItem("userid");
    navigate("/login/");
  };

  const value = {
    saveAccessToken,
    saveRefreshToken,
    onLogout,
    userData,
    userId,
    saveUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
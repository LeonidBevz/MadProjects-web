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
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const saveAccessToken = (token) => {
    localStorage.setItem("access", token);
  };

  /*const saveRefreshToken = (token) => {
    localStorage.setItem("refresh", token);
  };*/

  const saveUserData = (data) => {
    localStorage.setItem("userdata", data);
    if (!data.id) {
      console.log("wrong user data");
      return;
    }
    localStorage.setItem("userid", data.id);
    setUserId(data.id);
  };

  const onLogout = () => {
    localStorage.removeItem("access");
    //localStorage.removeItem("refresh");
    setUserData(null);
    localStorage.removeItem("userdata");
    setUserId(null);
    localStorage.removeItem("userid");
    navigate("/login/");
  };

  const handleLogOut = async () => {
    if (!navigator.serviceWorker.controller) {
      console.error("Service Worker не доступен");
      onLogout(); 
      return;
    }
  
    try {
      navigator.serviceWorker.controller.postMessage({ type: 'close' });
      setIsLoggingOut(true)

      await new Promise((resolve) => {
        const handleMessage = (event) => {
          if (event.data.type === 'socket_closed') {
            navigator.serviceWorker.removeEventListener('message', handleMessage);
            resolve();
          }
        };
  
        navigator.serviceWorker.addEventListener('message', handleMessage);
      });
  
      onLogout();
      setIsLoggingOut(false)
    } catch (error) {
      console.error("Ошибка при logout:", error);
      onLogout();
      setIsLoggingOut(false)
    }
  };

  const value = {
    saveAccessToken,
    handleLogOut,
    userData,
    userId,
    saveUserData,
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
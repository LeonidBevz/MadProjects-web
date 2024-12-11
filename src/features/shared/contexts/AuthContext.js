import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem("userid") || null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || null);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const saveAccessToken = (token) => {
    localStorage.setItem("access", token);
  };

  /*const saveRefreshToken = (token) => {
    localStorage.setItem("refresh", token);
  };*/

  const saveUserData = (data) => {
    if (!data.id) {
      console.log("wrong user data");
      return;
    }
    localStorage.setItem("userid", data.id);
    setUserId(data.id);
    setAccessToken(data.token)
  };

  const onLogout = () => {
    localStorage.removeItem("access");
    setAccessToken(null)
    //localStorage.removeItem("refresh");
    localStorage.removeItem("userdata");
    setUserId(null);
    localStorage.removeItem("userid");
  };

  const handleLogOut = async (navigateToLogin = true) => {
    if (!navigator.serviceWorker.controller) {
      console.error("Service Worker не доступен");
      onLogout(); 
      if (navigateToLogin) navigate("/login/");
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
      if (navigateToLogin) navigate("/login/");
      setIsLoggingOut(false)
    } catch (error) {
      console.error("Ошибка при logout:", error);
      onLogout();
      if (navigateToLogin) navigate("/login/");
      setIsLoggingOut(false)
    }
  };

  const value = {
    saveAccessToken,
    handleLogOut,
    userId,
    accessToken,
    saveUserData,
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
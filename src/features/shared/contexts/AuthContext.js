import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSharedUser } from "features/profile/hooks/useProfile";
import api from "../services/apiClient";
import { BackURL } from "urls";
import { useNotifications } from "./NotificationsContext";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [accessExpTime, setAccessExpTime] = useState(localStorage.getItem("accessTime") || null);
  const [refreshExpTime, setRefreshExpTime] = useState(localStorage.getItem("refreshTime") || null);
  const [profileImage, setProfileImage] = useState("")
  const [fullName, setFullName] = useState("")
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false)  

  const { data, refetch: refetchSharedUser } = useGetSharedUser(accessToken)
  
  

  useEffect(()=>{
    if (!data) return
    if (data.avatar){
      setProfileImage(data.avatar)
    }
    else{
      setProfileImage("/baseProfilePic.png")
    }
    setFullName(data.lastName+" "+data.firstName+" " + data.secondName)
    setRole(data.role)
  },[data])

  /*const saveRefreshToken = (token) => {
    localStorage.setItem("refresh", token);
  };*/

  const onLogout = () => {
    localStorage.removeItem("access");
    setAccessToken(null)
    localStorage.removeItem("refresh");
    setRefreshToken(null)
    localStorage.removeItem("role");
    setRole(null)
    localStorage.removeItem("accessTime");
    setAccessExpTime(null)
    localStorage.removeItem("refreshTime");
    setRefreshExpTime(null)    
  };

  const handleLogOut = async (navigateToLogin = true) => {
    if (!navigator.serviceWorker.controller) {
      //console.error("Service Worker не доступен");
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
      //console.error("Ошибка при logout:", error);
      onLogout();
      if (navigateToLogin) navigate("/login/");
      setIsLoggingOut(false)
    }
  };

  const value = {
    role, accessExpTime, refreshExpTime,
    accessToken,
    refreshToken,
    handleLogOut,   
    isLoggingOut,
    fullName,
    profileImage,
    refetchSharedUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSharedUser } from "features/profile/hooks/useProfile";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [tokenExpTime, setTokenExpTime] = useState(localStorage.getItem("tokenTime") || null);
  const [profileImage, setProfileImage] = useState("")
  const [fullName, setFullName] = useState("")
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const {data} = useGetSharedUser(accessToken)

  useEffect(()=>{
    if (!data) return
    if (data.avatar){
      setProfileImage(data.avatar)
    }
    else{
      setProfileImage("/baseProfilePic.png")
    }
    setFullName(data.lastName+" "+data.firstName+" " + data.secondName)
  },[data])

  const saveAccessToken = (token) => {
    localStorage.setItem("access", token);
    setAccessToken(token)
  };

  const saveRole = (role) =>{
    localStorage.setItem("role", role)
    setRole(role)
  }

  const saveTokenTime = (tokenTime) => {
    localStorage.setItem("tokenTime", tokenTime);
    setTokenExpTime(tokenTime)
  };

  /*const saveRefreshToken = (token) => {
    localStorage.setItem("refresh", token);
  };*/

  const onLogout = () => {
    localStorage.removeItem("access");
    setAccessToken(null)
    localStorage.removeItem("role");
    setRole(null)
    localStorage.removeItem("tokenTime");
    setTokenExpTime(null)
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
    accessToken, role, tokenExpTime,
    saveAccessToken, saveRole, saveTokenTime,
    handleLogOut,   
    isLoggingOut,
    fullName,
    profileImage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
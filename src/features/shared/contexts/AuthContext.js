import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSharedUser } from "features/profile/hooks/useProfile";
import api from "../services/apiClient";
import { BackURL } from "urls";

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
  
  async function getNewTokens(refresh){
    try {
        const response = await fetch(BackURL + "/auth/refresh", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + refresh,
            },          
        });
        
        if (response.status===200){
          const result = await response.json()
          return result
        }
        else {
          return null
        }
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
  }

  const updateTokens = async ()=>{
    const newTokens = await getNewTokens(localStorage.getItem('refresh'));
              
    if (newTokens) {
      localStorage.setItem("access", newTokens.accessToken);
      setAccessToken(newTokens.accessToken)
      localStorage.setItem("refresh", newTokens.refreshToken);
      setRefreshToken(newTokens.refreshToken)
      localStorage.setItem("role", newTokens.userType)
      setRole(newTokens.userType)
      localStorage.setItem("accessTime", newTokens.accessExpiresAt);
      setAccessExpTime(newTokens.accessExpiresAt)
      localStorage.setItem("refreshTime", newTokens.refreshExpiresAt);
      setRefreshExpTime(newTokens.refreshExpiresAt)
    }
  }

  useEffect(()=>{
    
    
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              
              const newTokens = await getNewTokens(localStorage.getItem('refresh'));
              
              if (newTokens) {
                localStorage.setItem("access", newTokens.accessToken);
                setAccessToken(newTokens.accessToken)
                localStorage.setItem("refresh", newTokens.refreshToken);
                setRefreshToken(newTokens.refreshToken)
                localStorage.setItem("role", newTokens.userType)
                setRole(newTokens.userType)
                localStorage.setItem("accessTime", newTokens.accessExpiresAt);
                setAccessExpTime(newTokens.accessExpiresAt)
                localStorage.setItem("refreshTime", newTokens.refreshExpiresAt);
                setRefreshExpTime(newTokens.refreshExpiresAt)

                api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
                return api(originalRequest);
              } else {
                window.location.href = '/login/';
              }
            }
        
            return Promise.reject(error);
      }
    );
  },[])

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
    refetchSharedUser,
    updateTokens
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
import React, { createContext, useContext } from "react";
import axios from "axios";
import { BackURL } from "urls";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const { saveAccessToken } = useAuth();
  const navigate = useNavigate()

  const api = axios.create({
    baseURL: BackURL,  
    headers: {
      'Content-Type': 'application/json',
    },
  });
     
  
  // Интерцептор запросов
  api.interceptors.request.use(
    (config) => {
      const accessToken1 = localStorage.getItem('access');
      if (accessToken1) {
        config.headers['Authorization'] = `Bearer ${accessToken1}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Интерцептор ответов
  /*api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const newTokens = await getNewTokens(localStorage.getItem('refresh'));
        
        if (newTokens) {
          saveAccessToken(newTokens.access)
          api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
          return api(originalRequest);  // Повторяем запрос с новым токеном
        } else {
         navigate('/login/');
        }
      }
  
      return Promise.reject(error);
    }
      
  );
  */
  return(
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>

  ) 
}

async function getNewTokens(refresh) {
  try {
    const response = await axios.post(`${BackURL}/api/token/refresh/`, { refresh });
    return response.data;
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    return null;
  }
}
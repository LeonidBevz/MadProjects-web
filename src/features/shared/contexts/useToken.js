import {BackURL, MessengerSocket} from "urls";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
//archive
const TokenContext = createContext();

export function useToken() {
    return useContext(TokenContext);
  }

export function TokenProvider({children}){
    const [userData, setUserData] = useState(localStorage.getItem('userdata') || null)
    const [isNightTheme, setIsNightTheme] = useState(localStorage.getItem('theme') === 'true' || false)
    const ws = useRef(null);
    const [iswsConnected, setIswsConnected] = useState(null)
    const [isSWRegistered, setIsSWRegistered] = useState(false)
    const [userId, setUserId] = useState(parseInt(localStorage.getItem('userid')) || null) 
    const [projectId, setProjectId] = useState(1)
    const [isSideBarPinned, setIsSideBarPinned] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
              setIsSWRegistered(true)   
            //console.log('Service Worker зарегистрирован');         
          })
          .catch(error => {
            //console.error('Ошибка регистрации Service Worker:', error);
          });
    
        // Прослушивание сообщений от Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          const message = event.data;
          if (message.type ==='socket_opened'){
            navigator.serviceWorker.controller.postMessage({type: "AUTHORIZE", data:  JSON.stringify({ type: "entities.Intent.Authorize", jwt: '3'})});
            setIswsConnected(true)
          }
          else if (message.type ==='socket_already_opened'){
            setIswsConnected(true)
          }
          else if (message.type ==='socket_closed'){
            setIswsConnected(false)
          }
          else if (message.type ==='SW_registered'){
            setIsSWRegistered(true)  
          }
        });
      } else {
        alert("Service Worker не поддерживается в вашем браузере, некоторые функции ограничены.")
        //console.log('Service Worker не поддерживается в этом браузере');
      }
    }, []);
   
    useEffect (()=>{
      //console.log("try start", isSWRegistered, userId)
      if (!isSWRegistered) return
      if (!navigator.serviceWorker.controller) {
        return
      }
      
      if (userId){
        navigator.serviceWorker.controller.postMessage({ type: 'start', url: MessengerSocket});
        return
      }
      else {
        navigator.serviceWorker.controller.postMessage({ type: 'close'});   
        alert("unauthorized")
        navigate('/login/')     
      }
    },[userId, isSWRegistered])
  
    const sendAction = (actionType, params) => {
      navigator.serviceWorker.controller.postMessage({type: "SEND_MESSAGE", data:  JSON.stringify({ type: "entities.Intent." + actionType, ...params })});
    };    

    useEffect(() => {
      if (!isNightTheme) {
        document.documentElement.style.setProperty('--main-blue-color', '#005AAA');
        document.documentElement.style.setProperty('--main-red-color', '#E4003A');
        document.documentElement.style.setProperty('--main-text-color', '#000000');
        document.documentElement.style.setProperty('--alt-text-color', '#ffffff');
        document.documentElement.style.setProperty('--bg-color', '#F7F9FA');
        document.documentElement.style.setProperty('--card-color', '#FFFFFF');
        document.documentElement.style.setProperty('--border-color', '#D9D9D9');
        document.documentElement.style.setProperty('--main-gradient', 'linear-gradient(270deg, var(--main-red-color), var(--main-blue-color))');
        document.documentElement.style.setProperty('--activity-100', '#005AAA');
        document.documentElement.style.setProperty('--activity-75', '#337BCC');
        document.documentElement.style.setProperty('--activity-50', '#66A3E6');
        document.documentElement.style.setProperty('--activity-25', '#99C8FF');
        document.documentElement.style.setProperty('--main-green-color', '#009A49');
      } else {
        document.documentElement.style.setProperty('--main-blue-color', '#005AAA');
        document.documentElement.style.setProperty('--main-red-color', '#E4003A');
        document.documentElement.style.setProperty('--main-text-color', '#d4d3cf');
        document.documentElement.style.setProperty('--alt-text-color', '#ffffff');
        document.documentElement.style.setProperty('--bg-color', '#192227');
        document.documentElement.style.setProperty('--card-color', '#1b1c1e');
        document.documentElement.style.setProperty('--border-color', '#D9D9D9');
        document.documentElement.style.setProperty('--main-gradient', 'linear-gradient(270deg, var(--main-red-color), var(--main-blue-color))');
        document.documentElement.style.setProperty('--activity-100', '#005AAA');
        document.documentElement.style.setProperty('--activity-75', '#337BCC');
        document.documentElement.style.setProperty('--activity-50', '#66A3E6');
        document.documentElement.style.setProperty('--activity-25', '#99C8FF');
        document.documentElement.style.setProperty('--main-green-color', '#009A49');        
      }
      localStorage.setItem('theme', isNightTheme)
  }, [isNightTheme]);

  const timeoutId = useRef(null);

  const onThemeChange = () => {
    const allElements = document.querySelectorAll('*');
    if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        } else {
            allElements.forEach((element) => {
                element.classList.add('all-trans');
            });
        }

        setIsNightTheme(!isNightTheme);

        timeoutId.current = setTimeout(() => {
            allElements.forEach((element) => {
                element.classList.remove('all-trans');
            });
            timeoutId.current = null;
        }, 1000);
  };

    const saveAccessToken = (token) => {
      localStorage.setItem('access', token);
    };

    const saveRefreshToken = (token) => {
        localStorage.setItem('refresh', token);
      };

    const saveUserData = (data) =>{
      localStorage.setItem('userdata', data);

      if (!data.id){
        //console.log("wrong user data")
        return
      }
      localStorage.setItem('userid', data.id);
      setUserId(parseInt(data.id))
    }
      
    const onLogout = () => {
      //logOut(localStorage.getItem("refresh"),localStorage.getItem("access"))
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUserData(null)
      localStorage.removeItem('userdata');
      setUserId(null)
      localStorage.removeItem('userid');
      navigate('/login/');
    };

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
  
    const contextValue= {
      saveAccessToken,
      saveRefreshToken,
      onLogout,    
      userData,
      userId,
      saveUserData,
      api,
      isNightTheme, setIsNightTheme,
      onThemeChange,
      ws, sendAction,
      iswsConnected, setIswsConnected,
      isSWRegistered,
      projectId, setProjectId,
      isSideBarPinned, setIsSideBarPinned
    }
    return (
        <TokenContext.Provider value={contextValue}>
             {children}
        </TokenContext.Provider>
      );
  };

  async function logOut(refresh_token, access_token){
    try {
        const response = await fetch(BackURL + "/api/logout/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },
            body: JSON.stringify({refresh_token}),
            
        });
        
        //console.log("Logout", response.status);
    } catch (error) {
        //console.error('Ошибка:', error);
        return null;
    }
}

async function getNewTokens(refresh){
    try {
        const response = await fetch(BackURL + "/api/token/refresh/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refresh}),
            
        });
        
        //console.log("Refreshed token", response.status);
        if (response.status===200){
          const result = await response.json()
          return result
        }
        else {
          return null
        }
    } catch (error) {
        //console.error('Ошибка:', error);
        return null;
    }
}
async function getUsername(token){
  try {
    const response = await fetch(BackURL + '/api/profile/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
            'ngrok-skip-browser-warning': 'true' //только для ngrok
        },       
    });
    
    if (response.status===200){
        const result = await response.json();
        return result.username              
    }
                    
  } catch (error) {
    //временно без сервера
    //console.error('Ошибка:', error);
    
    return null;
  }
}

  export default useToken;


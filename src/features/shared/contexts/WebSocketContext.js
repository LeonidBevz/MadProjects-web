import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessengerSocket } from "urls";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const ws = useRef(null);
  const [iswsConnected, setIswsConnected] = useState(null);
  const [isSWRegistered, setIsSWRegistered] = useState(false);
  const navigate = useNavigate();
  const {userId} = useAuth()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          if (navigator.serviceWorker.controller){
            setIsSWRegistered(true)
          }
          console.log('Service Worker зарегистрирован');         
        })
        .catch(error => {
          console.error('Ошибка регистрации Service Worker:', error);
        });
  
      // Прослушивание сообщений от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const message = event.data;
        console.log(message)
        if (message.type ==='socket_opened'){
          navigator.serviceWorker.controller.postMessage({type: "AUTHORIZE", data:  JSON.stringify({ type: "entities.Intent.Authorize", jwt: '3'})});
          console.log("try auth socket")
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
      console.log('Service Worker не поддерживается в этом браузере');
    }
  }, []);

  useEffect (()=>{
    console.log("try start", isSWRegistered, userId)
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
    navigator.serviceWorker.controller.postMessage({
      type: "SEND_MESSAGE",
      data: JSON.stringify({ type: `entities.Intent.${actionType}`, ...params }),
    });
  };

  

  return (
    <WebSocketContext.Provider value={{ ws, sendAction, iswsConnected, isSWRegistered }}>
      {children}
    </WebSocketContext.Provider>
  );
}
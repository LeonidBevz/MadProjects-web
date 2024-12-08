import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { MessengerSocket } from "urls";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const ws = useRef(null);
  const [iswsConnected, setIswsConnected] = useState(null);
  const [isSWRegistered, setIsSWRegistered] = useState(false);
  const { userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if ('serviceWorker' in navigator) { 
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker зарегистрирован', registration);
      
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log("Сервис-воркер активирован, отправляем сообщение");

              if (navigator.serviceWorker.controller) {
                setIsSWRegistered(true)
              }
            }
          });
        });
      
        if (navigator.serviceWorker.controller) {
          console.log("Controller уже активен");
          setIsSWRegistered(true)
        } else {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log("Контроллер изменен, отправляем сообщение");
            setIsSWRegistered(true)
          });
        }
      

        navigator.serviceWorker.ready.then(() => {
          console.log("Service Worker полностью активирован");
        });
      
      }).catch((error) => {
        console.error('Ошибка регистрации Service Worker:', error);
      });
  
      // Прослушивание сообщений от Service Worker
      const messageHandler = (event) => {


        const message = event.data;
        console.log(message);
        if (message.type === 'socket_opened') {
          navigator.serviceWorker.controller.postMessage({type: "AUTHORIZE", data:  JSON.stringify({ type: "entities.Intent.Authorize", jwt: '3'})});
          setIswsConnected(true);
        } else if (message.type === 'socket_already_opened') {
          setIswsConnected(true);
        } else if (message.type === 'socket_closed') {
          setIswsConnected(false);
          navigate("/login/")
        } else if (message.type === 'SW_registered') {
          setIsSWRegistered(true);
        } else if (message.type === 'RECEIVE_MESSAGE' && message.data.type ==="entities.Action.Unauthorized"){
         //возможны множественные перезагрузки
            if (userId){
              navigator.serviceWorker.controller.postMessage({ type: 'UNAUTHORIZE'}); 
              window.location.reload()
            }
            else{
              navigate('/login/')
            }
          
          
        }
      };

      navigator.serviceWorker.addEventListener('message', messageHandler)


      return ()=>{
        navigator.serviceWorker.removeEventListener('message', messageHandler)
        navigator.serviceWorker.controller.postMessage({ type: 'close'});
        navigator.serviceWorker.controller.postMessage({ type: 'CLIENT_CLOSED'});
      }

    } else {
      alert("Service Worker не поддерживается в вашем браузере, некоторые функции ограничены.")
      console.log('Service Worker не поддерживается в этом браузере');
    }
    // eslint-disable-next-line 
  }, []);

  useEffect (()=>{
    console.log("try start", isSWRegistered, userId, navigator.serviceWorker)
    if (!isSWRegistered) return
    if (!navigator.serviceWorker.controller) {
      return
    }
    
    if (userId){
      navigator.serviceWorker.controller.postMessage({ type: 'start', url: MessengerSocket});
      return
    }
    else {        
      alert("unauthorized socket")
      navigate("/login/")
    }
    // eslint-disable-next-line 
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
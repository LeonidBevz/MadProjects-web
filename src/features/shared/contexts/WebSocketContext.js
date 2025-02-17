import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {  MessengerSocket } from "urls";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./NotificationsContext";
import { useAuth } from "./AuthContext";
import { updateTokens } from "../services/apiClient";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [iswsConnected, setIswsConnected] = useState(null);
  const [isSWRegistered, setIsSWRegistered] = useState(false);
  const { accessExpTime, refreshExpTime } = useAuth()
  const navigate = useNavigate()
  const clientId = crypto.randomUUID();
  const { addNotification } = useNotifications()
  
  const startServiceWorker = () =>{
    if ('serviceWorker' in navigator) { 
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {     
        
        navigator.serviceWorker.ready.then(() => {
          if (navigator.serviceWorker.controller){
            setIsSWRegistered(true)
          }
          else{
            if (registration.active){
              registration.active.postMessage({type: "claim_clients"})
            }
          }
        });

      }).catch((error) => {
        //console.error('Ошибка регистрации Service Worker:', error);
      });
    }
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) { 
      startServiceWorker()

      // Прослушивание сообщений от Service Worker
      const messageHandler = (event) => {
        const message = event.data;
        //console.log("messege in main ",message);
        if (message.type === 'socket_opened') {
          navigator.serviceWorker.controller.postMessage({type: "AUTHORIZE", data:  JSON.stringify({ type: "entities.Intent.Authorize", jwt: localStorage.getItem("access") })});
          setIswsConnected(true);
        } else if (message.type === 'socket_already_opened') {
          setIswsConnected(true);
        } else if (message.type === 'socket_closed') {
          setIswsConnected(false);
          //addNotification("Сокет закрылся")
        } else if (message.type === 'SW_registered') {
          setIsSWRegistered(true);
        } else if (message.type === 'socket_error') {
          addNotification("Ошибка подключения ", message.data)
        } else if (message.type === 'socket_logout') {
          //addNotification("logout")
          navigator.serviceWorker.controller.postMessage({ type: 'close'}); 
          navigate("/login/")
        } else if (message.type === 'RECEIVE_MESSAGE' && message.data?.type === "entities.Action.Unauthorized") {
      
        }    
      };

      const handleFocus = () =>{
        checkSocket()
      }

      const addMessageListener = () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.addEventListener('message', messageHandler);
          window.addEventListener('focus', handleFocus)
        }
      };

      if (navigator.serviceWorker.controller) {
        addMessageListener();
      } else {
        const controllerChangeHandler = () => {
          //console.log("controller changed, new listner", navigator.serviceWorker.controller)
          navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
          addMessageListener();
        };
  
        navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
      }

      return ()=>{
        navigator.serviceWorker.removeEventListener('message', messageHandler)
        window.removeEventListener("focus", handleFocus)
        //console.log("Socket context unbuild")
      }

    } else {
      alert("Service Worker не поддерживается в вашем браузере, некоторые функции ограничены.")
      //console.log('Service Worker не поддерживается в этом браузере');
    }
    // eslint-disable-next-line 
  }, []);

  useEffect (()=>{
    const handleServiceWorker = async () => {
      if (!isSWRegistered) return;
  
      const controller = navigator.serviceWorker.controller;
      if (!controller) return;
  
      const currentTime = Date.now();
  
      if ((accessExpTime - 1000) > currentTime) {
        controller.postMessage({ type: 'start', url: MessengerSocket });
        return;
      }
  
      if ((refreshExpTime - 1000) > currentTime) {
        try {
          await updateTokens();
          controller.postMessage({ type: 'start', url: MessengerSocket });
        } catch (error) {
          console.error("Ошибка обновления токенов:", error);
          addNotification("Ошибка при обновлении токенов", "error");
          navigator.serviceWorker.controller.postMessage({type: "close"});
          navigate("/login/");
        }
        return;
      }
      addNotification("Сессия истекла, пожалуйста войдите снова", "info");
      navigator.serviceWorker.controller.postMessage({type: "close"});
      navigate("/login/");
    };
  
    handleServiceWorker();
    // eslint-disable-next-line 
  },[isSWRegistered])
  
  //поддерживание работы воркера пока пользователь на вкладке 
  const intervalRef = useRef(null);
  const stopTimeout = useRef(null)

  useEffect(() => {
    const startKeepInterval = () => {
      if (stopTimeout.current){
        clearTimeout(stopTimeout.current)
        stopTimeout.current = null
      }
      if (intervalRef.current) return; 

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "keep_alive" });
      }
        

      intervalRef.current = setInterval(() => {
        if (!navigator.serviceWorker.controller) return;
        navigator.serviceWorker.controller.postMessage({ type: "keep_alive" });
      }, 10000);

      console.log("Start interval", !!navigator.serviceWorker.controller);
    };

    const clearKeepInterval = () => {
      if (intervalRef.current) {
        stopTimeout.current = setTimeout(()=>{
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log("Stop interval");
        }, 5*60*1000)        
      }
    };

    const handleStartInterval = () => {
      startKeepInterval();
    };

    const handleStopInterval = () => {
      clearKeepInterval();
    };

    window.addEventListener("focus", handleStartInterval);
    window.addEventListener("load", handleStartInterval);
    window.addEventListener("blur", handleStopInterval);

    return () => {
      window.removeEventListener("focus", handleStartInterval);
      window.removeEventListener("load", handleStartInterval)
      window.removeEventListener("blur", handleStopInterval);
      clearKeepInterval();
    };
  }, []);

  const sendAction = (actionType, params) => {
    navigator.serviceWorker.controller.postMessage({
      type: "SEND_MESSAGE",
      data: JSON.stringify({ type: `entities.Intent.${actionType}`, ...params }),
    });
  };

  const subscribeSocket = (channel, projectId) => {
    navigator.serviceWorker.controller.postMessage({
      type: "SUBSCRIBE",
      data: { channel: channel, projectId: projectId, clientId: clientId },
    });
  }

  const checkSocket = () =>{
    navigator.serviceWorker.controller.postMessage({
      type: "reconnect",
      data: {jwt: localStorage.getItem("access"), url: MessengerSocket}
    })
  }

  const unsubscribeSocket = (channel, projectId) => {
    navigator.serviceWorker.controller.postMessage({
      type: "UNSUBSCRIBE",
      data: { channel: channel, projectId: projectId, clientId: clientId },
    });
  }
  

  return (
    <WebSocketContext.Provider value={{ sendAction, iswsConnected, isSWRegistered, subscribeSocket, unsubscribeSocket, checkSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
}
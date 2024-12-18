import React, { createContext, useContext, useEffect, useState } from "react";
import {  MessengerSocket } from "urls";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./NotificationsContext";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [iswsConnected, setIswsConnected] = useState(null);
  const [isSWRegistered, setIsSWRegistered] = useState(false);
  const tokenExpTime = localStorage.getItem("tokenTime")
  const accessToken = localStorage.getItem("access")
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
        console.error('Ошибка регистрации Service Worker:', error);
      });
    }
  }

  useEffect(()=>{
    if ( navigator.serviceWorker.controller){
      const handleFocus = () =>{
        checkSocket()
      }
      window.addEventListener('focus', handleFocus)

      return ()=>{
        window.removeEventListener("focus", handleFocus)
      }
    }
  },[])

  useEffect(() => {
    if ('serviceWorker' in navigator) { 
      startServiceWorker()

      //sus
      /*window.addEventListener('focus', () => {
        console.log("focus", navigator.serviceWorker.controller)
        if (!navigator.serviceWorker.controller) {
          setIsSWRegistered(false)
          setIswsConnected(false)
          startServiceWorker()
        }
      });*/

      // Прослушивание сообщений от Service Worker
      const messageHandler = (event) => {
        const message = event.data;
        console.log(message);
        if (message.type === 'socket_opened') {
          navigator.serviceWorker.controller.postMessage({type: "AUTHORIZE", data:  JSON.stringify({ type: "entities.Intent.Authorize", jwt: accessToken })});
          setIswsConnected(true);
        } else if (message.type === 'socket_already_opened') {
          setIswsConnected(true);
        } else if (message.type === 'socket_closed') {
          setIswsConnected(false);
          addNotification("Сокет закрылся")
        } else if (message.type === 'SW_registered') {
          setIsSWRegistered(true);
        } else if (message.type === 'socket_error') {
          addNotification("Ошибка подключения ", message.data)
        }
      };

      navigator.serviceWorker.addEventListener('message', messageHandler)


      return ()=>{
        navigator.serviceWorker.removeEventListener('message', messageHandler)
        console.log("Socket context unbuild")
        navigator.serviceWorker.controller.postMessage({ type: 'close'});
      }

    } else {
      alert("Service Worker не поддерживается в вашем браузере, некоторые функции ограничены.")
      console.log('Service Worker не поддерживается в этом браузере');
    }
    // eslint-disable-next-line 
  }, []);

  useEffect (()=>{
    if (!isSWRegistered) return
    if (!navigator.serviceWorker.controller) {
      return
    }

    if ((tokenExpTime - 1000) > Date.now()){
      navigator.serviceWorker.controller.postMessage({ type: 'start', url: MessengerSocket});
      return
    }
    else {
      addNotification("Сессия истекла, пожалуйста войдите снова", "info")
      navigate("/login/")
    }
    // eslint-disable-next-line 
  },[isSWRegistered])

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
      data: {jwt: accessToken, url: MessengerSocket}
    })
  }

  const unsubscribeSocket = (channel, projectId) => {
    navigator.serviceWorker.controller.postMessage({
      type: "UNSUBSCRIBE",
      data: { channel: channel, projectId: projectId, clientId: clientId },
    });
  }
  

  return (
    <WebSocketContext.Provider value={{ sendAction, iswsConnected, isSWRegistered, subscribeSocket, unsubscribeSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
}
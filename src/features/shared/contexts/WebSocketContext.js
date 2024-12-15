import React, { createContext, useContext, useEffect, useState } from "react";
import { MessengerSocket } from "urls";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [iswsConnected, setIswsConnected] = useState(null);
  const [isSWRegistered, setIsSWRegistered] = useState(false);
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const clientId = crypto.randomUUID();
  
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

  useEffect(() => {
    if ('serviceWorker' in navigator) { 
      startServiceWorker()

      //sus
      window.addEventListener('focus', () => {
        console.log("focus", navigator.serviceWorker.controller)
        if (!navigator.serviceWorker.controller) {
          setIsSWRegistered(false)
          setIswsConnected(false)
          startServiceWorker()
        }
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
        } 
      };

      navigator.serviceWorker.addEventListener('message', messageHandler)


      return ()=>{
        navigator.serviceWorker.removeEventListener('message', messageHandler)
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
    
    if (accessToken){
      navigator.serviceWorker.controller.postMessage({ type: 'start', url: MessengerSocket});
      return
    }
    else {        
      alert("unauthorized socket")
    }
    // eslint-disable-next-line 
  },[accessToken, isSWRegistered])

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
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id =  Date.now() 
    const newNotification = {
      id: id,
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(id)
    }, 5000);
  };


  const removeNotification = (id) => {
    const notificationElement = document.getElementById(id);
    
    if (notificationElement) {
      notificationElement.classList.add('fade-out');

      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }, 500);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
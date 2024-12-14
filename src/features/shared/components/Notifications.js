import React  from 'react';
import Notification from './Notification'; 
import { useNotifications } from '../contexts/NotificationsContext';
import "css/notifications.css"

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  
  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <Notification
          id={notif.id}
          key={notif.id}
          message={notif.message}
          onClose={() => removeNotification(notif.id)}
          type={notif.type}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
import React, { useEffect } from 'react';

const Notification = ({ message, onClose, type, id }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`} id={id}>
      <p>{message}</p>
      <button className="close-btn" onClick={onClose}>✖</button>
    </div>
  );
};

export default Notification;
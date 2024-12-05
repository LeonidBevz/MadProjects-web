import React from "react";
import "css/lastactivity.css"

const LastActivity = ({date, link, text, linkTo}) => {
    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365);
      
        if (seconds < 60) {
          return "только что";
        } else if (minutes < 60) {
          return `${minutes} мин. назад`;
        } else if (hours < 24) {
          return `${hours} ч. назад`;
        } else if (days < 7) {
          return `${days} д. назад`;
        } else if (days < 30) {
          const weeks = Math.floor(days / 7);
          return `${weeks} нед. назад`;
        } else if (days < 365) {
          const months = Math.floor(days / 30);
          return `${months} мес. назад`;
        }else if (years < 5){
          return `${years} г. назад`;
        }else {
            return `${years} лет назад`;
        }
      };
  
    return (
      <div className="last-activity">          
        <p>{getTimeAgo(date)}</p>
        <hr/>    
        <p>{text}<a href={linkTo}>{link}</a></p>
      </div>
      
    );
  }
  
  export default LastActivity;
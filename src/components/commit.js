import React from "react";
import "./commit.css"
import useToken from "../hooks/useToken";
import { Link } from "react-router-dom";
import RightArrowIco from "../images/arrowrightico";


const Commit = ({name,date,username,link,profilepic}) => {
    const {isNightTheme} = useToken()
    const getTimeAgo = (date) => {
      const getWordEnding = (number, one, two, five) => {
          number = Math.abs(number) % 100;
          const n1 = number % 10;
          if (number > 10 && number < 20) {
            return five;
          }
          if (n1 > 1 && n1 < 5) {
            return two;
          }
          if (n1 === 1) {
            return one;
          }
          return five;
      };
      const now = new Date();
      const diff = now - new Date(date);
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
    
      if (seconds < 60) {
        return "только что";
      } else if (minutes < 60) {
        return `${minutes} минут${getWordEnding(minutes, 'у', 'ы', '')} назад`;
      } else if (hours < 24) {
        return `${hours} час${getWordEnding(hours, '', 'а', 'ов')} назад`;
      } else if (days < 7) {
        return `${days} день${getWordEnding(days, '', 'я', 'ей')} назад`;
      } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} недель${getWordEnding(weeks, 'ю', 'и', '')} назад`;
      } else if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} месяц${getWordEnding(months, '', 'а', 'ев')} назад`;
      } else {
        const years = Math.floor(days / 365);
        return `${years} год${getWordEnding(years, '', 'а', 'лет')} назад`;
      }
    };

    return (
      <div className="commit">          
            <div className="commit-left">
                <Link to={link} className="no-deco">
                    <p className="commit-name">{name}</p>
                </Link>
                <div className="commit-info">
                    <img alt="profile" src={profilepic}/>
                    <p>{`${username} создал коммит ${getTimeAgo(date)}`}</p>
                </div>
            </div>
            <Link to={link}>
                <RightArrowIco className="commit-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
            </Link>
      </div>
      
    );
  }
  
  export default Commit;
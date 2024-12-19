import { useNotifications } from "features/shared/contexts/NotificationsContext";
import React from "react";

const Kanban = ({cards}) => {
  
  const { addNotification } = useNotifications()

  const handleClick = ()=>{
    addNotification("Для управления задачами используйте канбан доску")
  }
  function formatDate(milliseconds) {
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
      const diff = now - new Date(milliseconds);
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
        return `${days} д${getWordEnding(days, 'ень', 'ня', 'ней')} назад`;
      } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} недел${getWordEnding(weeks, 'ю', 'и', 'ь')} назад`;
      } else if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} месяц${getWordEnding(months, '', 'а', 'ев')} назад`;
      } else {
        const years = Math.floor(days / 365);
        return `${years} ${getWordEnding(years, 'год', 'года', 'лет')} назад`;
      }
  }
  
  
  return (
    <div className="kanban" onClick={handleClick}> 
      <div className="kanban-main-container kanban-sprint">
        {cards.map((row, i)=>(
          <div className="kanban-row" key={i}>
            <div className="kanban-row-top">
              <p className="normal-cursor">{row.name}</p>
            </div>
            <div className="cards-container kanban-sprint" >
              {row.kards.map((card, j)=>(
                <div className="kanban-card" key={j}>
                  <div className="card-top">
                    <p className="card-name normal-cursor">{card.title}</p>
                  </div>
                  <p className="card-info">{`Автор: ${card.authorName}`}</p>
                  <p className="card-info">{`Создано: ${formatDate(card.createdTimeMillis)}`}</p>
                  <p className="card-info">{`Изменено: ${formatDate(card.updateTimeMillis)}`}</p>
                </div>
              ))}       
            </div>
          </div>
        ))}            
      </div>
    </div>
  );
};

export default Kanban;
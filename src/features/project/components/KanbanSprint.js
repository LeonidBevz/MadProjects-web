import { useNotifications } from "features/shared/contexts/NotificationsContext";
import React from "react";
import mixHexColors from "features/shared/components/ColorMIxer";
import useCSSVariable from "features/shared/hooks/useCssStyle";

const Kanban = ({cards}) => {
  
  const { addNotification } = useNotifications()

  const handleClick = ()=>{
    addNotification("Для управления задачами используйте канбан доску")
  }
  const backgroundColor = useCSSVariable("--bg-color")

  
  return (
    <div className="kanban" onClick={handleClick}> 
      <div className="kanban-main-container kanban-sprint">
        {cards.map((row, i)=>(
          <div className="kanban-row" style={{borderTop: `7px solid #${row.color}` , backgroundColor: mixHexColors(backgroundColor, row.color)}} key={i}>
            <div className="kanban-row-top">
              <p className="normal-cursor">{row.name}</p>
            </div>
            <div className="cards-container kanban-sprint" >
              {row.kards.map((card, j)=>(
                <div className="kanban-card" key={j}>
                  <div className="card-top" style={{margin:"0"}}>
                    <p className="card-name normal-cursor">{card.title}</p>
                  </div>
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
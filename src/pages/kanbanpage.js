import React, { useEffect, useState } from "react";
import MenuDotsIco from "../images/menudots";
import "./kanbanpage.css"
import useToken from "../hooks/useToken";

const KanbanPage = () => {
    const {isNightTheme} = useToken()
    const [cards, setCards] = useState([{rowName: "Пример1", cards: [
      {
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z"
      },{
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z",
      }
    ]},{rowName: "Пример2", cards: [
      {
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z"
      },{
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z",
      },{
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z",
      }, {
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z"
      },{
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z",
      },{
        name: "Фикс поиска",
        author: "Ilya Bundelev",
        created: "2024-09-28T12:30:00Z",
        updated: "2024-09-28T12:30:00Z",
      }
    ]}])

    
  
    return (
      <div className="kanban-page">          
        <div className={`kanban-main-container`}>
          {cards.map((row, i)=>(
            <div className={`kanban-row`} key={i}>
              <div className="kanban-row-top bg-trans">
                <p>{row.rowName}</p>
                <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots"/>
              </div>
              <div className="cards-container">
                {cards[i].cards.map((card,j)=>(
                  <div className="kanban-card" key={j}>
                    <div className="card-top">
                      <p className="card-name">{card.name}</p>
                      <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots"/>
                    </div>
                    <p className="card-info">{`Автор: ${card.author}`}</p>
                    <p className="card-info">{`Создано: ${card.created}`}</p>
                    <p className="card-info">{`Изменено: ${card.updated}`}</p>
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>
      
    );
  }
  
  export default KanbanPage;
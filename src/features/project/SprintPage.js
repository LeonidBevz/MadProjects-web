import React,{useState} from "react";
import Kanban from "./components/KanbanSprint";
import { useParams, useNavigate } from "react-router-dom";
import EditIco from "images/edit";
import "css/sprintpage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";

function formatDate(date) {
  const dateParts = date.slice(0, 10).split('-'); 
  const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
  return formattedDate;
}

const SprintPage = () => {
    const {sprint} = useParams()
    const {isNightTheme} = useTheme()
    const [data, setData] = useState({startDate: "2024-09-28T12:30:00Z", endDate: "2024-12-28T12:30:00Z", description: "Я в своем познании настолько преисполнился, что я как будто бы уже сто триллионов миллиардов лет проживаю на триллионах и триллионах таких же планет, как эта Земля, мне этот мир абсолютно понятен, и я здесь ищу только одного - покоя, умиротворения и вот этой гармонии, от слияния с бесконечно вечным, от созерцания великого фрактального подобия и от вот этого замечательного всеединства существа, бесконечно вечного, куда ни посмотри, хоть вглубь - бесконечно малое, хоть ввысь - бесконечное большое, понимаешь? "})
    const navigate = useNavigate()
    const [cards, setCards] = useState([
      {
        rowName: "Пример1",
        id: "row1",
        cards: [
          { name: "Фикс поиска", id: "card1", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
          { name: "Фикс поиска", id: "card2", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        ],
      },
      {
        rowName: "Пример2",
        id: "row2",
        cards: [
          { name: "Фикс поиска", id: "card3", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
          { name: "Фикс поиска", id: "card4", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        ],
      },
    ]);
  
    return (
      <div className="sprint-page page">  
         <div className="sprint-info-container">
              <div className="flex-title">
                <h2>{`Спринт / ${sprint}`} </h2>
                <EditIco 
                  className="edit" color={isNightTheme ? "#d4d3cf" : "black"} 
                  onClick={()=>{navigate("edit/", {
                    state: { name: sprint, description: data.description, endDate: data.endDate}
                  })}}/>
              </div>
              
              <div className="sprint-info-tile">
                <p>{`Дата начала: ${formatDate(data.startDate)}`}</p>
                <p>{`Планируемая дата завершения: ${formatDate(data.endDate)}`}</p>
                <button>Завершить</button>
            </div>
          </div>
          {data.description && (<div className="sprint-info-container">
              <h2>{`Описание`}</h2>
              <div className="sprint-info-tile">
                <p>{data.description}</p>
                
            </div>
          </div>)}
          <h2 className="goals-h2">Задачи</h2>   
          <div className="kanban-sprint-container">
            <Kanban cards={cards} setCards={setCards} />
          </div>
      </div>
    );
  }
  
  export default SprintPage;
import React from "react";
import LastActivity from "./components/LastActivity";
import { useNavigate, useParams} from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/activitypage.css"
import GitActivity from "./components/GitaAtivity";
import { useTheme } from "features/shared/contexts/ThemeContext";


const ActivityPage = () => {
    const {projectId} = useParams()
    const navigate = useNavigate()
    const {isNightTheme} = useTheme()
    const lastActivityData = [{date: "2024-08-29T10:00:00Z", link: "audoinautica-neuro", text: "Andrey Butyrev привязал новый репозиторий ", linkTo: "/profile"},{date: "2024-03-29T10:00:00Z", link: "audoinautica-neuro", text: "Andrey Butyrev привязал новый репозиторий ", linkTo: "/profile"}]
    const sprints = [{name: "Последние правки (текущий)", linkTo: "/bomba/"},{name: "Плейлисты & Поиск (25.08.24)",linkTo: "/bomba/"},{name:"Пилим MVP (28.04.24)",linkTo: "/bomba/"}]
    

    return (
      <div className="activity-page page">
        <div className="activity-page-container">
          <div className="activity-right-container">
            {lastActivityData.length !== 0 &&(
              <div className="last-activity-container">
                <h2>{`Последняя активность`}</h2>
                <div className="last-activity-tile">
                    {lastActivityData.map((data,index)=>(
                      <LastActivity 
                        date={data.date}
                        link={data.link} 
                        linkTo={data.linkTo}
                        text={data.text}
                        key={index}
                      />
                    ))}

                </div>
              </div>
            )}
            <div className="sprints-container">
              <h2>{`Спринты`}</h2>
              <div className="sprints-tile" >
                <button onClick={()=>navigate(`/${projectId}/sprints/create/`)}>Начать спринт</button>
                {sprints.map((sprint, index)=>(
                  <div className="sprint" key={index}>
                    <div className="sprints-flex" onClick={()=>navigate(`/${projectId}/sprints/${sprint.name}`)}>
                      <p>{sprint.name}</p>
                      <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="grad-separator"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <GitActivity/>
        </div>    
      </div>
      
    );
  }
  
  export default ActivityPage;
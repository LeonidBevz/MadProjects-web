import React, { useEffect, useState } from "react";
import LastActivity from "./components/LastActivity";
import { useNavigate, useParams} from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/activitypage.css"
import GitActivity from "./components/GitaAtivity";
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useGetLastActivities } from "./hooks/useProject";
import Loading from "features/shared/components/Loading";
import { useNotifications } from "features/shared/contexts/NotificationsContext";


const ActivityPage = () => {
    const {projectId} = useParams()
    const navigate = useNavigate()
    const {isNightTheme} = useTheme()
    const [lastActivityFormatted,setLastActivityFormatted] = useState([{date: "2024-08-29T10:00:00Z", link: "audoinautica-neuro", text: "Andrey Butyrev привязал новый репозиторий ", linkTo: "/profile"},{date: "2024-03-29T10:00:00Z", link: "audoinautica-neuro", text: "Andrey Butyrev привязал новый репозиторий ", linkTo: "/profile"}])
    const sprints = [{name: "Последние правки (текущий)", linkTo: "/bomba/"},{name: "Плейлисты & Поиск (25.08.24)",linkTo: "/bomba/"},{name:"Пилим MVP (28.04.24)",linkTo: "/bomba/"}]
    const {addNotification} = useNotifications()

    const {data: lastActivityData, isLoading: isActivityLoading, error: activityError } = useGetLastActivities(projectId, 7)
    useEffect(()=>{
      if(!activityError) return
      addNotification("Ошибка загрузки активностей", "error")
      setLastActivityFormatted([])
      // eslint-disable-next-line
    },[activityError])

    useEffect(()=>{
      if (!lastActivityData) return
      const users = lastActivityData.actors

      const newFormatedData = lastActivityData.activities.map(activity => {
        const user = users[activity.actorId] 
        let formatted

        switch (activity.type){
          case "SprintStart":
            formatted = {
              date: activity.timeMillis, 
              text: `${user.lastName + " " +user.firstName} начал спринт `,
              link: activity.targetTitle,
              linkTo: `/${projectId}/sprints/${activity.targetId}`
            }
            break
          case "SprintFinish":
            formatted = {
              date: activity.timeMillis, 
              text: `${user.lastName + " " +user.firstName} завершил спринт `,
              link: activity.targetTitle,
              linkTo: `/${projectId}/sprints/${activity.targetId}`
            }
            break
          case "RepoBind":
            formatted = {
              date: activity.timeMillis, 
              text: `${user.lastName + " " +user.firstName} привязал репозиторий `,
              link: activity.targetTitle,
              linkTo: activity.targetTitle
            }
            break
          case "RepoUnbind":
            formatted = {
              date: activity.timeMillis, 
              text: `${user.lastName + " " +user.firstName } отвязал репозиторий `,
              link: activity.targetTitle,
              linkTo: activity.targetTitle
            }
            break
          case "MemberAdd":
            formatted = {
              date: activity.timeMillis, 
              text: `${activity.targetTitle} присоединился к проекту `,
            }
            break
          case "MemberRemove":
           formatted = {
             date: activity.timeMillis, 
             text: `${user.lastName + " " +user.firstName} выгнал ${activity.targetTitle} из проекта`,
          }
          break
          case "KardMove":
           formatted = {
             date: activity.timeMillis, 
             text: `${user.lastName + " " +user.firstName} передвинул карточку ${activity.targetTitle} в столбец ${activity.secondaryTargetTitle}`,
          }
          break
            
          default:
            formatted = {};
            break
        }
        return formatted
        
      })

      setLastActivityFormatted(newFormatedData)
      // eslint-disable-next-line
    },[lastActivityData])

    return (
      <div className="activity-page page">
        <div className="activity-page-container">
          <div className="activity-right-container">
            {isActivityLoading && (<Loading/>)}
            {lastActivityFormatted.length !== 0 && !isActivityLoading && (
              <div className="last-activity-container" style={{maxWidth: "720px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}> 
                  <h2>{`Последняя активность`}</h2>
                  <span style={{ margin:"20px 5px 10px 2rem", fontWeight: "300", fontStyle: "italic", textDecoration: "underline"}}>Больше</span>
                </div>
                <div className="last-activity-tile">
                    {lastActivityFormatted.map((data,index)=>(
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
            <div className="sprints-container" style={{maxWidth: "720px"}}>
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
import React, {useEffect, useState} from "react";
import Loading from "features/shared/components/Loading";
import { useParams } from "react-router-dom";
import { useGetLastActivities } from "./hooks/useProject";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import LastActivity from "./components/LastActivity";

const LastActivitiesPage = () => {
    const {projectId} = useParams()
    const {addNotification} = useNotifications()
    const [lastActivityFormatted, setLastActivityFormatted] = useState([])
    
    const {data: lastActivityData, isLoading: isActivityLoading, error: activityError } = useGetLastActivities(projectId)
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

    if (isActivityLoading){
        return (
            <div>
                <Loading/>
            </div>
        )
    }
    if (activityError){
        return(
            <div>
                {"Ошибка загрузки "+ activityError.status}
            </div>
        )
    }
  
    return (
      <div className="info-page page">          
         <div className="info-container">
            <h1>Активность за все время</h1>
            {lastActivityFormatted.length === 0 && (
                <div style={{textAlign: "center"}}>Тут пусто</div>
            )}
            {lastActivityFormatted.length > 0 && (
                <div className="info-tile">
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
            )}
        </div>
      </div>
    );
  }
  
  export default LastActivitiesPage;
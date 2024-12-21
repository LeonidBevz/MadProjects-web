import React, { useEffect, useState } from "react";
import LastActivity from "./components/LastActivity";
import { useNavigate, useParams} from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/activitypage.css"
import GitActivity from "./components/GitaAtivity";
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useGetLastActivities, useGetProjectSprints } from "./hooks/useProject";
import Loading from "features/shared/components/Loading";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import SprintStatusSpan from "./components/SprintStatusSpan";

const ActivityPage = () => {
    const {projectId} = useParams()
    const navigate = useNavigate()
    const {isNightTheme, isSideBarPinned} = useTheme()
    const [lastActivityFormatted,setLastActivityFormatted] = useState([])
    const {addNotification} = useNotifications()

    const {data: sprintsData, isLoading: isSprintsLoading, error: sprintsError} = useGetProjectSprints(projectId)
   
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

      setLastActivityFormatted(newFormatedData.reverse())
      // eslint-disable-next-line
    },[lastActivityData])

   
    if (isActivityLoading || isSprintsLoading){
      return (
      <div className="loading-page page">
        <Loading/>
      </div>)
    }
    return (
      <div className="activity-page page">
        <div className={`activity-page-container ${isSideBarPinned ? "activity-pinned":""}`} >
          <div className="activity-right-container">
            {lastActivityFormatted.length !== 0 && !isActivityLoading && (
              <div className="last-activity-container" style={{maxWidth: "720px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}> 
                  <h2>{`Последняя активность`}</h2>
                  {lastActivityFormatted.length === 7 && (
                    <span onClick={()=>{navigate(`/${projectId}/lastactivities`)}} style={{ margin:"20px 5px 10px 2rem", fontWeight: "300", fontStyle: "italic", textDecoration: "underline", cursor: "pointer"}}>
                      Больше
                    </span>
                  )}
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
            <div className="sprints-container" style={{maxWidth: "720px", width: "100%"}}>
              <h2>{`Спринты`}</h2>
              <div className="sprints-tile" >
                <button onClick={()=>navigate(`/${projectId}/sprints/create/`)}>Начать спринт</button>
                
                {!sprintsError && sprintsData.length === 0 &&  (<div style={{marginTop: "15px", display: "flex", justifyContent: "center", fontStyle: "italic", fontWeight: "500", color: "var(--main-text-color)"}}> Пока что тут пусто</div>)}
                {sprintsError && (<div style={{marginTop: "15px", display: "flex", justifyContent: "center", fontStyle: "italic", fontWeight: "500"}}> { "Ошибка: " + sprintsError.status}</div>)}

                {!sprintsError && sprintsData.map((sprint, index)=>(
                  <div className="sprint" key={index}>
                    <div className="sprints-flex" onClick={()=>navigate(`/${projectId}/sprints/${sprint.id}`)}>
                      <p>
                        {sprint.title + " (" +sprint.supposedEndDate + ") " }
                        <SprintStatusSpan sprint={sprint}/>
                      </p>
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
import React,{useEffect } from "react";
import Kanban from "./components/KanbanSprint";
import { useParams, useNavigate } from "react-router-dom";
import EditIco from "images/edit";
import "css/sprintpage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useFinishSprint, useGetSprint } from "./hooks/useProject";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import NotFoundPage from "features/shared/notfound";
import Loading from "features/shared/components/Loading";

const SprintPage = () => {
    const {sprint: sprintId} = useParams()
    const {isNightTheme} = useTheme()
    //const [data, setData] = useState({startDate: "2024-09-28T12:30:00Z", endDate: "2024-12-28T12:30:00Z", description: "Я в своем познании настолько преисполнился, что я как будто бы уже сто триллионов миллиардов лет проживаю на триллионах и триллионах таких же планет, как эта Земля, мне этот мир абсолютно понятен, и я здесь ищу только одного - покоя, умиротворения и вот этой гармонии, от слияния с бесконечно вечным, от созерцания великого фрактального подобия и от вот этого замечательного всеединства существа, бесконечно вечного, куда ни посмотри, хоть вглубь - бесконечно малое, хоть ввысь - бесконечное большое, понимаешь? "})
    const navigate = useNavigate()
    const {addNotification} = useNotifications()

    const {data, isLoading, error} = useGetSprint(sprintId)
    useEffect(()=>{
      if (!error) return
      if (error.status === 404 || error.status === 500 ) return

      addNotification("Что-то пошло не так " + error.status, "error")
      // eslint-disable-next-line 
    },[error])

    
    const {mutate, isLoading: isFinishLoading, error: finishError, isSuccess: isFinishSuccess} = useFinishSprint()
    useEffect(()=>{
      if (!finishError) return
      addNotification("Ошибка завершения " + finishError.status,"error")
       // eslint-disable-next-line 
    },[finishError])
    useEffect(()=>{
      if (!isFinishSuccess) return
      addNotification("Спринт успешно завершен" ,"success")
      navigate(-1)
      // eslint-disable-next-line 
    },[isFinishSuccess])

    const formatDate = (date)=>{
      const [day, month, year] = date.split(".");

      return `${year}-${month}-${day}`;
    }
    
    const handleEnd = ()=>{
      mutate(sprintId)
    }
    if (error?.status === 404 || error?.status === 500 ){
      return (
        <NotFoundPage/>
      )
    }

    if (isLoading){
      return (
        <div className="loading-page page">
          <Loading/>
        </div>
      )
    }
  
    return (
      <div className="sprint-page page">  
         <div className="sprint-info-container">
              <div className="flex-title">
                <h2>{`Спринт / ${data.meta.title}`} </h2>
                <EditIco 
                  className="edit" color={isNightTheme ? "#d4d3cf" : "black"} 
                  onClick={()=>{navigate("edit/", {
                    state: { name: data.meta.title, description: data.meta.desc, endDate: formatDate(data.meta.supposedEndDate), chosenTasks: data.kanban.columns }
                  })}}/>
              </div>
              
              <div className="sprint-info-tile">
                <p>{`Дата начала: ${data.meta.startDate}`}</p>
                <p>{`Планируемая дата завершения: ${data.meta.supposedEndDate}`}</p>
                {isFinishLoading && (<Loading/>)}
                {!isFinishLoading && (
                  <button onClick={handleEnd}>Завершить</button>
                )} 
            </div>
          </div>
          {data.meta.desc && (<div className="sprint-info-container">
              <h2>{`Описание`}</h2>
              <div className="sprint-info-tile">
                <p>{data.meta.desc}</p>
                
            </div>
          </div>)}
          <h2 className="goals-h2"> Задачи</h2>   
          {data.kanban.columns?.length > 0 && (
            <div className="kanban-sprint-container">
              <Kanban cards={data.kanban.columns} />
            </div>
          )}
          {data.kanban.columns?.length === 0 && (<span style={{marginTop: "1rem"}}>Задачи не выбраны</span>)}
      </div>
    );
  }
  
  export default SprintPage;
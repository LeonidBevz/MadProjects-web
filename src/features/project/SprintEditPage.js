import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChoseManyDropDown from "./components/ChoseManydd";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import { useGetProjectKards, useUpdateSprint } from "./hooks/useProject";
import Loading from "features/shared/components/Loading";

const SprintEditPage = () => {
    const location = useLocation();
    const {name, description, chosenTasks} = location.state || {}

    const [newName,setNewName] = useState(name)
    const [newDescription,setNewDescription] = useState(description)
    const [errorMessage,setErrorMessage] = useState("")
    const [chosenCards,setChosenCards] = useState(chosenTasks.flatMap(column => column.kards))
    const { addNotification } = useNotifications()
    const { projectId, sprint: sprintId } = useParams()
    const navigate = useNavigate()

    const {data: kards, error} = useGetProjectKards(projectId) 
    
    useEffect(()=>{
      if (!error) return
      setErrorMessage("Ошибка загрузки задач", error.status)
      addNotification("Ошибка загрузки задач","error")
      // eslint-disable-next-line 
    },[error])


    const {mutate, isLoading, error: updateError, isSuccess} = useUpdateSprint()
    
    useEffect(()=>{
      if (!updateError) return
      setErrorMessage("Ошибка редактирования ", updateError.status)
    },[updateError])

    useEffect(()=>{
      if (!isSuccess) return

      addNotification("Успешно обновлено!","success")
      navigate(-1)
    },[isSuccess])

    const handleSubmit = (event)=>{
      event.preventDefault()
      const newTasks = chosenCards.filter(card => !chosenTasks.some(task => task.id === card.id))

      const data = {
        sprintId: sprintId,
        title: newName,
        desc: newDescription,
        kardIds: newTasks.map(kard => kard.id)
      }
   
      mutate(data)
    }
    const handleNameChange = (event) => {
      setNewName(event.target.value);
    }

    const handleDescriptionChange = (event) => {
      setNewDescription(event.target.value);
    }
    return (
      <div className="sprint-page page">          
        <h2>Редактировать спринт</h2>
        <div className="edit-container">
          <form onSubmit={handleSubmit}>
            <div className="flex-edit">
              <div className="name-cont">
                  <label>Название</label>
                  <input
                    className="edit-container-input"
                    placeholder="Укажите название"
                    value={newName}
                    onChange={handleNameChange}
                    maxLength={25}
                    required
                  />
              </div>
              
            </div>
            <div>
                <label>Описание</label>
                <textarea
                  placeholder="Укажите описание"
                  value={newDescription}
                  onChange={handleDescriptionChange}
                  maxLength={1000}
                  required
                />
            </div>
            <div>
              <label>Задачи</label>
              <ChoseManyDropDown values={kards} displayKey={"title"} selectedValues={chosenCards} setSelectedValues={setChosenCards} emptyMessage={"Добавить задачи"}/>
            </div>
            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
            {isLoading && (<Loading/>)}
            {!isLoading && (
              <div className="flex-buttons">
                <button className= "login-but" type="submit">Сохранить</button>
                <button className= "login-but" type="button" onClick={()=>{navigate(-1)}}>Отмена</button>
              </div>
            )}
            
          </form>
        </div>
      </div>
      
    );
  }
  
  export default SprintEditPage;
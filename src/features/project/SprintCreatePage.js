import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChoseManyDropDown from "./components/ChoseManydd";
import { useCreateSprint, useGetProjectKards } from "./hooks/useProject";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import Loading from "features/shared/components/Loading";

const SprintCreatePage = () => {
  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split("-");
    return `${day}.${month}.${year}`;
  }

    const {projectId} = useParams()
    const [newName,setNewName] = useState("")
    const [newDescription,setNewDescription] = useState("")
    const [newEndDate, setNewEndDate] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const today = new Date().toISOString().split('T')[0];
    const [chosenCards, setChosenCards] = useState([])
    const navigate = useNavigate()
    const {addNotification} = useNotifications()

    const {mutate, isLoading: isCreateLoading, error: createError, isSuccess: isCreateSuccess} = useCreateSprint()

    useEffect(()=>{
      if (!isCreateSuccess) return
      addNotification("Спринт успешно создан!","success")
      navigate(-1)
      // eslint-disable-next-line 
    },[isCreateSuccess])

    useEffect(()=>{
      if (!createError) return
      setErrorMessage("Ошибка отправки", createError.status)
      addNotification("Ошибка отправки","error")
      // eslint-disable-next-line 
    },[createError])

    const {data: kards, error} = useGetProjectKards(projectId) 

    useEffect(()=>{
      if (!error) return
      setErrorMessage("Ошибка загрузки задач", error.status)
      addNotification("Ошибка загрузки задач","error")
      // eslint-disable-next-line 
    },[error])

    const handleSubmit = (event)=>{
      event.preventDefault()
      if (chosenCards.length === 0){
        setErrorMessage("Не выбраны задачи!")
        return
      }

      const data = {
        projectId: projectId,
        title: newName,
        desc: newDescription,
        endDate: formatDate(newEndDate),
        kardIds: chosenCards.map(kard => kard.id)
      }
      mutate(data)
    }
    const handleNameChange = (event) => {
      setNewName(event.target.value);
    }
    const handleDateChange = (event) => {
      setNewEndDate(event.target.value);
    }
    const handleDescriptionChange = (event) => {
      setNewDescription(event.target.value);
    }
    return (
      <div className="sprint-page page">          
        <h2>Создать спринт</h2>
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
              <div className="date-cont"> 
                  <label>Дата завершения</label>
                  <input
                    className="edit-container-input"
                    placeholder="Укажите дату"
                    type="date"
                    value={newEndDate}
                    onChange={handleDateChange}
                    min={today}
                    max="2100-01-01" 
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
              <ChoseManyDropDown values={kards} displayKey={"title"} selectedValues={chosenCards} setSelectedValues={setChosenCards} emptyMessage={"Выберите задачи"}/>
            </div>
            {errorMessage && (<p className="error-message" style={{marginTop: "10px"}}>{errorMessage}</p>)}
            {isCreateLoading && (
              <Loading/>
            )}
            {!isCreateLoading && (
              <div className="flex-buttons">
                <button className= "login-but" type="submit">Создать</button>
                <button className= "login-but" type="button" onClick={()=>{navigate(-1)}}>Отмена</button>
              </div>
            )}
          </form>
        </div>
      </div>
      
    );
  }
  
  export default SprintCreatePage;
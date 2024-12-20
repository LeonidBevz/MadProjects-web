import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditTeacher } from "../hooks/useProfile";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";

const ProfessorProfileEditPage = () => {
    const location = useLocation();
    const {addNotification} = useNotifications()
    const {refetchSharedUser} = useAuth()
    const { rank, firstName, secondName, lastName } = location.state || {};
    
    const [professorForm, setProfessorForm] = useState({
        surname: lastName,
        name: firstName,
        iname: secondName,
        rank: rank
    })
    const [errorMessage, setErrorMessage] = useState("")

    const {mutate, isLoading, error, isSuccess} = useEditTeacher()

    useEffect(()=>{
          if (!error)return
          setErrorMessage("Что-то пошло не так ", error.status)
        },[error])
    
    useEffect(()=>{
      if (!isSuccess) return
      refetchSharedUser()
      addNotification("Данные успешно изменены","success")
      navigate(-1)
      // eslint-disable-next-line 
    },[isSuccess])

    const navigate = useNavigate()

    useEffect(()=>{
      console.log("fetch-server-for-data")      
      // eslint-disable-next-line
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfessorForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (event)=>{
      event.preventDefault()
      const isNameChanged = professorForm.name !== firstName 
      const isSurnameChanged = professorForm.surname !== lastName
      const isInameChanged = professorForm.iname !== secondName 
      const isGroupChanged = professorForm.rank !== rank

      if (!(isNameChanged || isGroupChanged || isInameChanged || isSurnameChanged)){
          setErrorMessage("Изменений нет")
          return
      }
      mutate({
        firstName: isNameChanged ? professorForm.name : null,
        secondName: isInameChanged ? professorForm.iname : null,
        lastName: isSurnameChanged ? professorForm.surname : null,
        data: isGroupChanged ? professorForm.rank : null
      })     

    }
    
    return (
      <div className="sprint-page page">          
        <h2>Редактировать профиль</h2>
        <div className="edit-container">
          <form onSubmit={handleSubmit}>
            <div className="name-cont">
                <label htmlFor="name">Имя</label>
                <input
                  className="edit-container-input"
                  placeholder="Имя"
                  value={professorForm.name}
                  onChange={handleChange}
                  maxLength={24}
                  id="name"
                  name="name"
                  required
                />
            </div>
            <div>
                <label htmlFor="surname">Фамилия</label>
                <input
                  className="edit-container-input"
                  placeholder="Фамилия"
                  value={professorForm.surname}
                  onChange={handleChange}
                  id="surname"
                  name="surname"
                  maxLength={24}
                  required
                />
            </div>
            <div>
                <label htmlFor="iname">Отчество</label>
                <input
                  className="edit-container-input"
                  placeholder="Отчество"
                  id="iname"
                  name="iname"
                  value={professorForm.iname}
                  onChange={handleChange}
                  maxLength={24}
                  required
                />
            </div>
            <div>
                <label htmlFor="rank">Учебная степень, звание</label>
                <input
                  className="edit-container-input"
                  placeholder="Учебная степень"
                  id="rank"
                  name="rank"
                  value={professorForm.rank}
                  onChange={handleChange}
                  maxLength={64}
                  required
                />
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
  
  export default ProfessorProfileEditPage;
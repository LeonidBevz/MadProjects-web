import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEditCommonProfile } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";
import { useAuth } from "features/shared/contexts/AuthContext";
import { useNotifications } from "features/shared/contexts/NotificationsContext";


const StudentProfileEditPage = () => {
    const location = useLocation();
    const { group, firstName, secondName, lastName } = location.state || {};
    const { refetchSharedUser }= useAuth()
    const { addNotification } = useNotifications()

    const [studentForm, setStudentForm] = useState({
        surname: lastName,
        name: firstName,
        iname: secondName,
        group: group,
    })
    
    const [errorMessage, setErrorMessage] = useState("")

    const {mutate, isLoading, error, isSuccess} = useEditCommonProfile()

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (event)=>{
      event.preventDefault()
      const isNameChanged = studentForm.name !== firstName 
      const isSurnameChanged = studentForm.surname !== lastName
      const isInameChanged = studentForm.iname !== secondName 
      const isGroupChanged = studentForm.group !== group

      if (!(isNameChanged || isGroupChanged || isInameChanged || isSurnameChanged)){
          setErrorMessage("Изменений нет")
          return
      }
      mutate({
        firstName: isNameChanged ? studentForm.name : null,
        secondName: isInameChanged ? studentForm.iname : null,
        lastName: isSurnameChanged ? studentForm.surname : null,
        data: isGroupChanged ? studentForm.group : null
      })     

    }
    
    return (
      <div className="sprint-page">          
        <h2>Редактировать профиль</h2>
        <div className="edit-container">
          <form onSubmit={handleSubmit}>
            <div className="flex-edit">
              <div className="name-cont">
                  <label htmlFor="name">Имя</label>
                  <input
                    className="edit-container-input"
                    placeholder="Имя"
                    value={studentForm.name}
                    onChange={handleChange}
                    maxLength={24}
                    id="name"
                    name="name"
                    required
                  />
              </div>
              <div className="date-cont"> 
                  <label htmlFor="group">Номер группы</label>
                  <input
                    className="edit-container-input"
                    placeholder="Группа"
                    value={studentForm.group}
                    onChange={handleChange}
                    maxLength={24}
                    id="group"
                    name="group"
                    required
                  />
              </div>
            </div>
            <div>
                <label htmlFor="surname">Фамилия</label>
                <input
                  className="edit-container-input"
                  placeholder="Фамилия"
                  value={studentForm.surname}
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
                  value={studentForm.iname}
                  onChange={handleChange}
                  maxLength={24}
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
  
  export default StudentProfileEditPage;
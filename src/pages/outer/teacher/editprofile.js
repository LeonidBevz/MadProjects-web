import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfessorProfileEditPage = () => {
    //можно будет использовать useLocation
    const [studentForm, setStudentForm] = useState({
        surname: "",
        name: "",
        iname: "",
        rank: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    useEffect(()=>{
      console.log("fetch-server-for-data")      
      // eslint-disable-next-line
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (event)=>{
      event.preventDefault()
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
                  value={studentForm.name}
                  onChange={handleChange}
                  maxLength={64}
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
                  value={studentForm.surname}
                  onChange={handleChange}
                  id="surname"
                  name="surname"
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
                  value={studentForm.rank}
                  onChange={handleChange}
                  required
                />
            </div>
            
            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
            <div className="flex-buttons">
              <button className= "login-but" type="submit">Сохранить</button>
              <button className= "login-but" type="button" onClick={()=>{navigate(-1)}}>Отмена</button>
            </div>
          </form>
        </div>
      </div>
      
    );
  }
  
  export default ProfessorProfileEditPage;
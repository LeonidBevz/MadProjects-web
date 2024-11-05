import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchDropDown from "../../../components/searchdropdown";
import ReposTile from "../../../components/repostile";
import NewRepoModal from "../../../components/newRepo";

const CreateProjectPage = () => {
    const [newName,setNewName] = useState("")
    const [newDescription,setNewDescription] = useState("")
    const [memberCount, setMemberCount] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [chosenProfessor, setChosenProfessor] = useState("")
    const [repos, setRepos] = useState([{name: "audionautica-web"},{name: "audionautica-android"},{name: "audionautica-neuro"}])
    const [newRepo, setNewRepo] = useState([])
    const [modalWindow, setModalWindow] = useState(0)
    const navigate = useNavigate()
    
    const handleSubmit = (event)=>{
      event.preventDefault()
    }
    const handleNameChange = (event) => {
      setNewName(event.target.value);
    }
    const handleMemberCountChange = (event) => {
      setMemberCount(event.target.value);
    }
    const handleDescriptionChange = (event) => {
      setNewDescription(event.target.value);
    }
    const handleAddRepo = () =>{
        setNewRepo("")
        setModalWindow(1)
    }
    const addRepo = () =>{
        console.log("onAddRepo")
        setModalWindow(0)
    }

    return (
      <div className="sprint-page">   
        <div className={modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"}/>
        {modalWindow === 1 && (<NewRepoModal onConfirm={addRepo} onCancel={()=>setModalWindow(0)} newRepo={newRepo} setNewRepo={setNewRepo}/>)}         
        <h2>Создать проект</h2>
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
                    maxLength={64}
                    required
                  />
              </div>
              <div className="date-cont"> 
                  <label>Число участников</label>
                  <input
                    className="edit-container-input"
                    placeholder="Укажите число"
                    type="number"
                    value={memberCount}
                    onChange={handleMemberCountChange}
                    min={1}
                    max={20} 
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
                  required
                />
            </div>
            <div className="">
                <p>Преподаватель</p>
                <div className="flex1">
                  <SearchDropDown values={["Смэрть"]} chosenOption={chosenProfessor} setChosenOption={setChosenProfessor} emptyMessage={"Выберите преподавателя"}/>
                </div>
            </div>
            <div className="info-container">
               <p>Укажите репозитории</p>
               <ReposTile repos={repos} setRepos={setRepos} handleAddRepo={handleAddRepo} noBS={true}/>
            </div>
            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
            <div className="flex-buttons">
              <button className= "login-but" type="submit">Создать</button>
              <button className= "login-but" type="button" onClick={()=>{navigate(-1)}}>Отмена</button>
            </div>
          </form>
        </div>
      </div>
      
    );
}
  
export default CreateProjectPage;
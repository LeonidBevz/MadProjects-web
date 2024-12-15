import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReposTile from "features/shared/components/ReposTile";
import NewRepoModal from "features/shared/components/NewRepo";
import { useGetProfessors, useCreateProject } from "../hooks/useProfile";
import ObjectSearchDropDown from "features/shared/components/ObjectSearchDropDown";
import Loading from "features/shared/components/Loading";
import ProjectCreated from "../components/ProjectCreated";

const CreateProjectPage = () => {
    const [newName,setNewName] = useState("")
    const [newDescription,setNewDescription] = useState("")
    const [memberCount, setMemberCount] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [chosenProfessor, setChosenProfessor] = useState("")
    const [repos, setRepos] = useState([])
    const [modalWindow, setModalWindow] = useState(0)
    const [professorsList, setProfessorsList] = useState([])
    const navigate = useNavigate()

    const {data: professorsData, error: professorsError } = useGetProfessors()
    const { mutate, isLoading, error, isSuccess } = useCreateProject()
    
    useEffect(()=>{
      if (!professorsData) return
      
      const newProfessors = professorsData.map(professor => ({
        name: professor.lastName + " " + professor.firstName + " " + professor.secondName,
        id: professor.id, 
        username: professor.username    
      }))

      setProfessorsList(newProfessors)
    },[professorsData])

    useEffect(()=>{
      if (!error)return
      switch (error.status){
        default: 
          setErrorMessage("Что-то пошло не так!")
      }
    },[error])

    const handleSubmit = (event)=>{
      event.preventDefault()
      if (!chosenProfessor){
        setErrorMessage('Не выбран преподаватель!')
        return
      }
      mutate({
        title: newName,
        desc: newDescription,
        maxMembersCount: memberCount,
        curatorId: chosenProfessor.id,
        repoLinks: repos
      })     
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
        setModalWindow(1)
    }
    const addRepo = (newRepo) =>{
      setRepos([...repos, newRepo])
      setModalWindow(0)
    }

    if (isSuccess){
      return (
        <ProjectCreated/>
      )
    }

    return (
      <div className="sprint-page">   
        <div className={`${modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
        {modalWindow === 1 && (<NewRepoModal onConfirm={addRepo} onCancel={()=>setModalWindow(0)}/>)}         
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
                    maxLength={25}
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
                  maxLength={1000}
                  required
                />
            </div>
            <div className="">
                <p>Преподаватель</p>
                {professorsError && (
                  <div>
                    {`Ошибка получения профессоров ${professorsError.status}`}
                  </div>
                )}
                {!professorsError && (
                  <div className="flex1">
                    <ObjectSearchDropDown values={professorsList} displayKey={"name"} altFilterKey={["username"]} chosenOption={chosenProfessor} setChosenOption={setChosenProfessor} emptyMessage={"Выберите преподавателя"}/>
                  </div>
                )}
               
            </div>
            <div className="info-container">
               <p>Укажите репозитории</p>
               <ReposTile repos={repos} setRepos={setRepos} handleAddRepo={handleAddRepo} noBS={true}/>
            </div>
            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
            {isLoading && (<Loading/>)}
            {!isLoading && (
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
  
export default CreateProjectPage;
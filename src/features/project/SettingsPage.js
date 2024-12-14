import React, {useState, useEffect} from "react";
import RightArrowIco from "images/arrowrightico";
import CrossIco from "images/cross";
import EditProjectModal from "./components/EditProject";
import DeleteProjectModal from "./components/DeleteProject";
import NewRepoModal from "features/shared/components/NewRepo";
import ReposTile from "../shared/components/ReposTile";
import "css/settingspage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useProjectContext } from "./contexts/ProjectContext";

const SettingsPage = () => {
    const {isNightTheme} = useTheme()
    const [modalWindow, setModalWindow] = useState(0)
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newRepo,setNewRepo] = useState("")
    const { projectData, members, repos: prRepos } = useProjectContext()
    const [data, setData] = useState({ 
      title: "",
      description: "",
      team: [],
    })
    const [repos, setRepos] = useState([])

    useEffect(()=>{
      if(!projectData) return
  
      setData({
        name: projectData.title,
        description: projectData.desc,
        team: members
      })
      setRepos(prRepos.map(item => item.link))
      // eslint-disable-next-line 
    },[projectData])
  
    const deleteMember = (id) =>{
     
    }

    const handleEditProject = () =>{
      setNewTitle(data.name)
      setNewDescription(data.description)
      setModalWindow(1)
    }
    const handleAddRepo = () =>{
      setNewRepo("")
      setModalWindow(3)
    }
    const editProject = () =>{
      setModalWindow(0)
    }
    const deleteProject = () =>{
      console.log("onDelete")
      setModalWindow(0)
    }
    const addRepo = () =>{
      console.log("onAddRepo")
      setModalWindow(0)
    }
    return (
      <div className="info-page page">
        <div className={modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"}/>
        {modalWindow === 1 && (<EditProjectModal onConfirm={editProject} onCancel={()=>setModalWindow(0)} newTitle={newTitle} newDescription={newDescription} setNewTitle={setNewTitle} setNewDescription={setNewDescription}/>)}  
        {modalWindow === 2 && (<DeleteProjectModal onConfirm={deleteProject} onCancel={()=>setModalWindow(0)}/>)}   
        {modalWindow === 3 && (<NewRepoModal onConfirm={addRepo} onCancel={()=>setModalWindow(0)} newRepo={newRepo} setNewRepo={setNewRepo}/>)}        
        <div className="info-container">
          <h2>Команда</h2>
          <div className="info-tile">
            {data.team.map((member, index)=>(
              <div className="sprint" key={index}>
                <div className="settings-flex">
                  <p>{member.lastName + " " + member.firstName+ " " + member.secondName  }</p>
                  <CrossIco className="settings-cross" onClick={()=>deleteMember(member.id)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                </div>
                <div className="grad-separator"></div>
              </div>
            ))}
            <div className="sprint">
              <div className="settings-flex">
                <p>Добавить...</p>
                <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
              </div>
              <div className="grad-separator"></div>
            </div>
          </div>
        </div>
        <div className="info-container">
          <h2>Репозитории</h2>
          <ReposTile repos={repos} setRepos={setRepos} handleAddRepo={handleAddRepo}/>
       </div>
       <div className="info-container">
           <h2>Общее</h2>
           <div className="buttons-tile">
             <button className="edit-butt" onClick={()=>handleEditProject()}>Изменить название/описание</button>
             <button className="delete-butt" onClick={()=>setModalWindow(2)}>Удалить проект</button>
          </div>
       </div>
     </div>      
    );
  }
  
  export default SettingsPage;
import React, {useState} from "react";
import RightArrowIco from "../images/arrowrightico";
import CrossIco from "../images/cross";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./settingspage.css"
import EditProjectModal from "../components/editproject";
import DeleteProjectModal from "../components/deleteproject";
import NewRepoModal from "../components/newRepo";
import ReposTile from "../components/repostile";

const SettingsPage = () => {
    const {project} = useParams()
    const navigate = useNavigate()
    const {isNightTheme} = useToken()
    const [modalWindow, setModalWindow] = useState(0)
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newRepo,setNewRepo] = useState("")
    const [repos, setRepos] = useState([{name: "audionautica-web"},{name: "audionautica-android"},{name: "audionautica-neuro"}])

    const [data, setData] = useState({
        description: "Audionautica - это платформа для стриминга и прослушивания музыки. Оно позволяет пользователям создавать плейлисты, искать треки по жанрам, исполнителям или альбомам, и сохранять любимые песни для оффлайн-прослушивания. Встроенные алгоритмы подбирают персональные рекомендации на основе музыкальных предпочтений, а также доступен режим караоке и создание совместных плейлистов с друзьями. Простое управление, качественное аудио и возможность делиться любимой музыкой делают это приложение идеальным для меломанов.",
        team: [{name: "Leonid"},{name: "Kalesty"}],
        repos: [{name: "audionautica-web"},{name: "audionautica-android"},{name: "audionautica-neuro"}],
        readmeurl: "a",
    })
  
    const deleteMember = (index) =>{
      const newMembers = data.team.filter((_, i) => i !== index);
      setData((prevData) => ({
          ...prevData,
          team: newMembers,
      }));
    }

    const handleEditProject = () =>{
      setNewTitle(project)
      setNewDescription(data.description)
      setModalWindow(1)
    }
    const handleAddRepo = () =>{
      setNewRepo("")
      setModalWindow(3)
    }
    const editProject = () =>{
      console.log("onEdit")
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
      <div className="info-page">
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
                  <p onClick={()=>navigate(`/profile/${member.name}`)}>{member.name}</p>
                  <CrossIco className="settings-cross" onClick={()=>deleteMember(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
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
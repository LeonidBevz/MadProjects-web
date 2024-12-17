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
import { useAddRepo, useDeleteMemeber, useDeleteProject, useDeleteRepo } from "./hooks/useProject";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import InviteModal from "./components/InviteModal";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
    const {isNightTheme} = useTheme()
    const [modalWindow, setModalWindow] = useState(0)
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newRepo,setNewRepo] = useState("")
    const { projectData, members, repos: prRepos, refetch } = useProjectContext()
    const { addNotification } = useNotifications()
    const navigate = useNavigate()

    const [data, setData] = useState({ 
      title: "",
      description: "",
      team: [],
    })
    const [repos, setRepos] = useState([])

  
    const {mutate: mutateAddRepo, error: addError, isSuccess: isAddSuccess} = useAddRepo()
    useEffect(()=>{
      if (!isAddSuccess) return
      refetch()
      // eslint-disable-next-line
    },[isAddSuccess])

    useEffect(()=>{
      if (!addError) return
      addNotification("Ошибка добавления " + addError.status,"error")
      // eslint-disable-next-line
    },[addError])


    const {mutate: mutateDeleteRepo, error: repoDeleteError, isSuccess: isRepoDeleteSuccess} = useDeleteRepo()
    useEffect(()=>{
      if (!isRepoDeleteSuccess) return
      addNotification("Репозиторий успешно удален из проекта", "success")
      // eslint-disable-next-line
    },[isRepoDeleteSuccess])

    useEffect(()=>{
      if (!repoDeleteError) return
      addNotification("Ошибка удаления " + repoDeleteError.status,"error")
      // eslint-disable-next-line
    },[repoDeleteError])

    const {mutate: mutateDeleteMember, error: deleteMemberError, isSuccess: isDeleteMemberSuccess} = useDeleteMemeber()
    useEffect(()=>{
      if (!isDeleteMemberSuccess) return
      addNotification("Участник успешно удален из проекта", "success")
      // eslint-disable-next-line
    },[isDeleteMemberSuccess])

    useEffect(()=>{
      if (!deleteMemberError) return
      addNotification("Ошибка удаления " + deleteMemberError.status,"error")
      // eslint-disable-next-line
    },[deleteMemberError])


    const {mutate: mutateDeleteProject, error: deleteProjectError, isSuccess: isDeleteProjectSuccess} = useDeleteProject()
    useEffect(()=>{
      if (!isDeleteProjectSuccess) return
      addNotification("Проект успешно удален", "success")
      navigate("/profile/")
      // eslint-disable-next-line
    },[isDeleteProjectSuccess])

    useEffect(()=>{
      if (!deleteProjectError) return
      addNotification("Ошибка удаления " + deleteProjectError.status,"error")
      // eslint-disable-next-line
    },[deleteProjectError])
    

    useEffect(()=>{
      if(!projectData) return
  
      setData({
        name: projectData.title,
        description: projectData.desc,
        team: members
      })
      setRepos(prRepos.map(item => item.link))
      // eslint-disable-next-line 
    },[projectData, prRepos, members])
  
    const deleteMember = (id) =>{
      setData((prevData) => ({
        ...prevData,
        team: prevData.team.filter((member) => member.id !== id),
      }));
      mutateDeleteMember({projectId: projectData.id, memberId: id})
    }
    const handleDeleteRepo = (repoName) => {
      const repoToDelete = prRepos.find(repo => repo.link === repoName && repo)
      if(!repoToDelete) return
      mutateDeleteRepo({projectId: projectData.id, repoId: repoToDelete.id}) 
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
    const handleAddMember = () =>{
      setModalWindow(4)
    }
    const editProject = () =>{
      setModalWindow(0)
    }
    const deleteProject = () =>{
      mutateDeleteProject({projectId: projectData.id})
      setModalWindow(0)
    }
    const addRepo = (newRepo) =>{
      mutateAddRepo({projectId: projectData.id, repoLink: newRepo})
      setModalWindow(0)
    }
   
    return (
      <div className="info-page page">
        <div className={`${modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
        {modalWindow === 1 && (<EditProjectModal onConfirm={editProject} onCancel={()=>setModalWindow(0)} newTitle={newTitle} newDescription={newDescription} setNewTitle={setNewTitle} setNewDescription={setNewDescription}/>)}  
        {modalWindow === 2 && (<DeleteProjectModal onConfirm={deleteProject} onCancel={()=>setModalWindow(0)}/>)}   
        {modalWindow === 3 && (<NewRepoModal onConfirm={addRepo} onCancel={()=>setModalWindow(0)} newRepo={newRepo} setNewRepo={setNewRepo}/>)}  
        {modalWindow === 4 && (<InviteModal onConfirm={()=>setModalWindow(0)} onCancel={()=>setModalWindow(0)} projectId={projectData.id}/>)}      
        <div className="info-container">
          <h2>Команда</h2>
          <div className="info-tile">
            {data.team.map((member, index)=>(
              <div className="sprint" key={index}>
                <div className="settings-flex">
                  <p>{member.lastName + " " + member.firstName+ " " + member.secondName  }</p>
                  {index > 0 &&(
                    <CrossIco className="settings-cross" onClick={()=>deleteMember(member.id)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                  )}
                </div>
                <div className="grad-separator"></div>
              </div>
            ))}
            <div className="sprint">
              <div className="settings-flex" onClick={handleAddMember}>
                <p>Добавить...</p>
                <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
              </div>
              <div className="grad-separator"></div>
            </div>
          </div>
        </div>
        <div className="info-container">
          <h2>Репозитории</h2>
          <ReposTile onDelete = {handleDeleteRepo} repos={repos} setRepos={setRepos} handleAddRepo={handleAddRepo}/>
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
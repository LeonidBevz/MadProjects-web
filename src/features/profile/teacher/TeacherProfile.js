import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import CreateGroupModal from "features/profile/components/CreateGroupModal";
import "css/profilepage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useDeletePGroup, useGetTeacherProfile } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";
import { useAuth } from "features/shared/contexts/AuthContext";
import GitLogo from "images/gitlogo.svg"
import CrossIco from "images/cross";
import DeletePGModal from "../components/DeleteProjectGroupModal";
import { useNotifications } from "features/shared/contexts/NotificationsContext";

const TeacherProfilePage = () => {
    const {isNightTheme} = useTheme()
    const [modalWindow, setModalWindow] = useState(0)
    const navigate = useNavigate()
    const [isGitAuth, setIsGitAuth] = useState(false)
    const [groupToEdit, setGroupToEdit] = useState()
    const { accessToken } = useAuth()
    const {addNotification} = useNotifications()

    const { data, isLoading, error, refetch} = useGetTeacherProfile()

    const {mutate} = useDeletePGroup()
    
    useEffect(()=>{
        if (!data) return
        if (data.githubMeta){
            setIsGitAuth(true)
        }
        else{
            setIsGitAuth(false)
        }

    },[data])
    
    const onGroupCreate = () =>{
        refetch()
        setModalWindow(0)
    }

    const handleGitAuth = ()=>{
        navigate(`/git/auth?code=&state=${accessToken}`)
    }

    const handleDeleteGroupClick = (group, e) => {
        e.stopPropagation();
        setGroupToEdit(group)
        setModalWindow(2)
    }

    const onGroupDelete = (id) => {
        console.log(id)
            mutate(id, {
            onSuccess: () => {
                addNotification("Успешно удалено","success")
                setModalWindow(0)
                refetch()
            },
            onError: (error) => {
                addNotification(`Ошибка удаления ${error.code}!`,"error")
            }
    });

    }

    if (isLoading) {
        return(
            <div className="loading-page page">
                <Loading/>
            </div>
        )
    }

    if (error){
        return(
            <div>
                {`Ошибка загрузки ${error.status}`}
            </div>
        )
    }
  

    return (
      <div className="profile-page page">
        <div className={`${modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
        {modalWindow === 1 && (<CreateGroupModal onCancel={()=>{setModalWindow(0)}} onConfirm={onGroupCreate}/>)}   
        {modalWindow === 2 && (<DeletePGModal name = {groupToEdit.title} onCancel={()=>{setModalWindow(0)}} onDelete={()=>onGroupDelete(groupToEdit.id)}/>)}        
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    <div className="prifile-image">
                        <img className="profile-pic" src={isGitAuth && data.githubMeta.githubAvatar ? data.githubMeta.githubAvatar : "/baseProfilePic.png"} alt="profile"/>
                       
                          <button onClick={()=>{navigate("edit", {state: {rank: data.grade, firstName: data.firstName, secondName:data.secondName, lastName: data.lastName}})}} className="profile-edit-but"/>
                  
                    </div>
                    <p className="profile-username">{`${data.lastName} ${data.firstName} ${data.secondName}`}</p>
                    <p>{data.grade}</p>
                </div>
                <div>
                    {!isGitAuth && (
                      <div className="git-not-auth-container">
                         <img className="git-logo" src={GitLogo} alt="GitHub" style={{marginTop: "15px"}}/>
                         <span style={{marginBottom: "10px"}}> GitHub не авторизован.</span> 
                         <button onClick={handleGitAuth}>Авторизовать</button>
                      </div>
                    )}
                    <div className="link-container">
                        <p>Email: </p>
                        <div className="profile-link">
                            <a href={`mailto:${data.email}`}>{data.email}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Группы проектов</h2>
            <div className="profile-projects">
            <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>{setModalWindow(1)}}>
                        <p>Создать группу...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                {data.projectGroups.map((group, index)=>(<div className="profile-projects-item" key={index}>
                    <div className="profile-projects-content" onClick={()=>navigate(`/teacher/group/${group.id}/`)}>
                        <p>{group.title}</p>
                        <CrossIco style={{width: "1rem", marginRight: "0.5rem"}} color={isNightTheme ? "#d4d3cf" : "black"} onClick={(e)=>handleDeleteGroupClick(group,e)}/>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>))}
            </div>
        </div>
      </div>
      
    );
  }
  
  export default TeacherProfilePage;
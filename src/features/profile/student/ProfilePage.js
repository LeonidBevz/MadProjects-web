import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/profilepage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useGetStudentProfile } from "../hooks/useProfile";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";
import GitLink from "../components/GitLink";
import JoinModal from "../components/JoinModal";
import ProjectStatusSpan from "../components/ProjectStateSpan";

const ProfilePage = () => {
    const { isNightTheme } = useTheme()
    const [isGitAuth, setIsGitAuth] = useState(false)
    const [modalWindow, setModalWindow] = useState(0)
    const {role} = useAuth()

    const navigate = useNavigate()

    const {accessToken} = useAuth()
    
    const { data, isLoading, error} = useGetStudentProfile()

    useEffect(()=>{
        if (role === "Curator"){
          navigate("/teacher/profile/")
        }
        // eslint-disable-next-line
    },[role])

    useEffect(()=>{
        if (!data) return
        if (data.githubMeta){
            setIsGitAuth(true)
        }
        else{
            setIsGitAuth(false)
        }
    },[data])

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
      <div className="profile-page">     
        <div className={`${modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
        {modalWindow === 1 && (<JoinModal onCancel={()=>setModalWindow(0)}/>)}  
             
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                        <div className="prifile-image">
                        <img className="profile-pic" src={isGitAuth ? data.githubMeta.githubAvatar : "/baseProfilePic.png"} alt="profile"/>
                        <button onClick={()=>{navigate("edit", {state: {group: data.group, firstName: data.firstName, secondName:data.secondName, lastName: data.lastName}})}} className="profile-edit-but"/>
                    </div>
                    <p className="profile-username">{` ${data.lastName} ${data.firstName} ${data.secondName}`}</p>
                    <p>Группа {data.group}</p>
                </div>
                <div>
                    {accessToken && (
                        <GitLink data={data.githubMeta} isGitAuth={isGitAuth}/>
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
            <h2>Мои проекты</h2>
            <div className="profile-projects">
                <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>navigate("createProject/")}>
                        <p>Создать проект...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>setModalWindow(1)}>
                        <p>Присоединиться к проекту...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                {data.projects.map((project, index) => (
                    <div className="profile-projects-item" key={index}>
                        <div className="profile-projects-content" onClick={()=>navigate(`/${project.id}/activity/`)}>
                            <p>{`${project.title} `}
                                <ProjectStatusSpan project={project}/>
                            </p>
                            <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                        </div>
                        <div className="profile-projects-separator"></div>
                    </div>
                ))}                
            </div>
        </div>
      </div>
      
    );
  }
  
  export default ProfilePage;
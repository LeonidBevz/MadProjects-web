import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/profilepage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useGetStudentProfile } from "../hooks/useProfile";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";
import GitLink from "../components/GitLink";

const ProfilePage = () => {
    const { isNightTheme } = useTheme()
    const [isGitAuth, setIsGitAuth] = useState(false)

    const navigate = useNavigate()

    const {accessToken} = useAuth()
    
    const { data, isLoading, error} = useGetStudentProfile()

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
            <div className="loading-page">
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
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                        <div className="prifile-image">
                        <img className="profile-pic" src={isGitAuth ? data.githubMeta.githubAvatar : "/baseProfilePic.png"} alt="profile"/>
                        <Link to="/profile/edit/" >
                          <button className="profile-edit-but"/>
                        </Link>
                    </div>
                    <p className="profile-username">{`${data.firstName} ${data.secondName} ${data.lastName}`}</p>
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
                    <div className="profile-projects-content" onClick={()=>navigate("/createProject/")}>
                        <p>Создать проект...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                <div className="profile-projects-item">
                    <div className="profile-projects-content">
                        <p>Присоединиться к проекту...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                {data.projects.map((project, index) => (
                    <div className="profile-projects-item" key={index}>
                        <div className="profile-projects-content" onClick={()=>navigate(`/${project.id}/activity/`)}>
                            <p>{project.title}</p>
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
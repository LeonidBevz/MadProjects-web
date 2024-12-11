import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/profilepage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useGetProfileGitData } from "../hooks/useProfile";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";
import GitLink from "../components/GitLink";

const ProfilePage = () => {
    const { isNightTheme } = useTheme()
    const navigate = useNavigate()

    const {accessToken, userId} = useAuth()

    const [data, setData] = useState({username: "Бунделев Илья Иииигоревич", gitlink: "https://github.com/Kaelesty", EmailLink: "example@gmail.com", group: "4215"})
    
    const { 
        data: gitData, 
        isLoading: isGitDataLoading, 
        error: gitError, 
        isSuccess: isGitSuccess
    } = useGetProfileGitData(accessToken, userId)
    
    return (
      <div className="profile-page">          
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    {isGitDataLoading && (<Loading/>)}
                    {!isGitDataLoading && (
                        <div className="prifile-image">
                        <img className="profile-pic" src={isGitSuccess ? gitData.githubAvatar : "/baseProfilePic.png"} alt="profile"/>
                        <Link to="/profile/edit/" >
                          <button className="profile-edit-but"/>
                        </Link>
                    </div>
                    )}
                    <p className="profile-username">{data.username}</p>
                    <p>Группа {data.group}</p>
                </div>
                <div>
                    {accessToken && userId && (
                        <GitLink data={gitData} isLoading={isGitDataLoading} error={gitError}/>
                    )}
                    <div className="link-container">
                        <p>Email: </p>
                        <div className="profile-link">
                            <a href={`mailto:${data.EmailLink}`}>{data.EmailLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Мои проекты</h2>
            <div className="profile-projects">
                <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>navigate("/1/activity/")}>
                        <p>audionautica</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
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
                
            </div>
        </div>
      </div>
      
    );
  }
  
  export default ProfilePage;
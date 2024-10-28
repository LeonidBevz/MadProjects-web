import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./profilepage.css"
import RightArrowIco from "../images/arrowrightico";

const ProfilePage = () => {
    const {isNightTheme} = useToken()
    const [username,setUsername] = useState("Kaelesty")
    const [gitLink,setGitLink] = useState("https://github.com/Kaelesty")
    const [EmailLink,setEmailLink] = useState("example@gmail.com")

    const navigate = useNavigate()
  
    return (
      <div className="profile-page">          
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    <div className="prifile-image">
                        <img className="profile-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="profile"/>
                        <Link to="/profile/edit/" >
                          <button className="profile-edit-but"/>
                        </Link>
                    </div>
                    <p className="profile-username">{username}</p>
                </div>
                <div>
                    <div className="link-container">
                        <p>GitHub: </p>
                        <div className="profile-link">
                            <a href={gitLink}>{gitLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                    <div className="link-container">
                        <p>Email: </p>
                        <div className="profile-link">
                            <a href={`mailto:${EmailLink}`}>{EmailLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Мои проекты</h2>
            <div className="profile-projects">
                <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>navigate("/audionautica/activity/")}>
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
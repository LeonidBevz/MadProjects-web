import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import LogoIco from "../images/logoico";
import SunIMG from "./../images/sun.svg"
import NightIMG from "./../images/night.svg"
import LogoutIMG from "./../images/logout.svg"
import useToken from "../hooks/useToken";
import "./profilepage.css"
import RightArrowIco from "../images/arrowrightico";

const ProfilePage = () => {
    const {isNightTheme, setIsNightTheme} = useToken()
    const [username,setUsername] = useState("Абобус")
    const [gitLink,setGitLink] = useState("https://github.com/Kaelesty")
    const [EmailLink,setEmailLink] = useState("example@gmail.com")

    const navigate = useNavigate()
  
    return (
      <div className="profile-page">          
        <div className="profile-top-menu bg-trans">
          <div className="profile-sepline"></div>
          <div className="profile-top-content">
            <div className="flex-start"></div>
            <div className="flex-center"><LogoIco color={isNightTheme ? "white": "black"} className="logo"/></div>
            <div className="flex-end">
                <div className="theme-icon-container bg-trans" onClick={()=>{setIsNightTheme(!isNightTheme)}}>
                    <div className={`theme-icon theme-icon-1 ${isNightTheme ? "theme-icon-hidden-1" : "theme-icon-active"}`}>
                      <img src={SunIMG} alt="sun" />
                    </div>
                    <div className={`theme-icon theme-icon-2 ${isNightTheme ? "theme-icon-active " : "theme-icon-hidden-2"}`}>
                      <img src={NightIMG} alt="night" />
                    </div>
                </div>
                <button className="topmenu-button bg-trans"><img src={LogoutIMG} alt="theme"/></button>
            </div>
          </div>
        </div>
        <div className="profile-page-content">
            <div className="profile-info bg-trans">
                <div className="profile-pic-container">
                    <img className="profile-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="profile"/>
                    <p className="profile-username">{username}</p>
                </div>
                <div>
                    <div className="link-container">
                        <p>GitHub: </p>
                        <div className="profile-link">
                            <a className="cl-trans" href={gitLink}>{gitLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                    <div className="link-container">
                        <p>Email: </p>
                        <div className="profile-link">
                            <a className="cl-trans" href={`mailto:${EmailLink}`}>{EmailLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="cl-trans">Мои проекты</h2>
            <div className="profile-projects bg-trans">
                <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>navigate("/audionautica/activity/")}>
                        <p>audionautica</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                <div className="profile-projects-item">
                    <div className="profile-projects-content">
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
import React, {useState} from "react";
import LogoIMG from "./../images/logo.svg"
import SunIMG from "./../images/sun.svg"
import NightIMG from "./../images/night.svg"
import LogoutIMG from "./../images/logout.svg"
import ArrowIMG from "./../images/arrow-.svg"
import "./profilepage.css"
import Activity from "../components/activity";

const ProfilePage = () => {
    const [isNightTheme, setIsNightTheme] = useState(false)
    const [username,setUsername] = useState("Абобус")
    const [gitLink,setGitLink] = useState("https://github.com/Kaelesty")
    const [EmailLink,setEmailLink] = useState("example@gmail.com")
  
    return (
      <div className="profile-page">          
        <div className="profile-top-menu">
          <div className="profile-sepline"></div>
          <div className="profile-top-content">
            <div className="flex-start"></div>
            <div className="flex-center"><img className="logo" src={LogoIMG} alt="logo"/></div>
            <div className="flex-end">
                <button className="topmenu-button" onClick={()=>{setIsNightTheme(!isNightTheme)}}>
                    <img src={isNightTheme ? NightIMG :SunIMG} alt="theme"/>
                </button>
                <button className="topmenu-button"><img src={LogoutIMG} alt="theme"/></button>
            </div>
          </div>
        </div>
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    <img className="profile-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="profile"/>
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
            <h1>Мои проекты</h1>
            <div className="profile-projects">
                <div className="profile-projects-item">
                    <div className="profile-projects-content">
                        <p>audionautica</p>
                        <img src={ArrowIMG} alt="arrow" />
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                <div className="profile-projects-item">
                    <div className="profile-projects-content">
                        <p>Создать проект...</p>
                        <img src={ArrowIMG} alt="arrow" />
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                <div className="profile-projects-item">
                    <div className="profile-projects-content">
                        <p>Присоединиться к проекту...</p>
                        <img src={ArrowIMG} alt="arrow" />
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                
            </div>
            <Activity/>
        </div>
      </div>
      
    );
  }
  
  export default ProfilePage;
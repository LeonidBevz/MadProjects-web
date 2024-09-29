import React, {useState, useEffect, useRef} from "react";
import LogoIMG from "./../images/logo.svg"
import SunIMG from "./../images/sun.svg"
import NightIMG from "./../images/night.svg"
import LogoutIMG from "./../images/logout.svg"
import ProfileIMG from "./../images/profile.svg"
import MenuIMG from "./../images/menu.svg"
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./topmenu.css"
import LogoIco from "../images/logoico";

const TopMenuPage = () => {
  const {isNightTheme, setIsNightTheme} = useToken()
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const profilepic = "https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg"
  const username = "Бевз Леонид Александрович"
  const project = "audionautica"
  const navigate = useNavigate()

  const sideMenuRef = useRef()
  const buttonRef = useRef()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current  && buttonRef.current && !(sideMenuRef.current.contains(event.target) || buttonRef.current.contains(event.target))) {
        setIsSideBarOpen(false);
      }
    };

    if (isSideBarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideBarOpen]);

    return (
      <div className="main-container">          
        <div className="top-menu">
          <div className="sepline"></div>
          <div className="top-menu-content">
            <div className="flex-start">
              <button className="topmenu-button-left" onClick={()=>setIsSideBarOpen(!isSideBarOpen)} ref={buttonRef}><img className={isSideBarOpen ? "ico-flip":""} src={MenuIMG} alt="menu"/></button>
            </div>
            <div className="flex-center">
            <LogoIco color={isNightTheme ? "white": "black"} className="logo"/>
              
            </div>
            <div className="flex-end">
                <button className="topmenu-button" onClick={()=>{setIsNightTheme(!isNightTheme)}}>
                    <img src={isNightTheme ? NightIMG :SunIMG} alt="theme"/>
                </button>
                <button className="topmenu-button" onClick={()=>{navigate("/profile")}}><img src={ProfileIMG} alt="profile"/></button>
                <button className="topmenu-button"><img src={LogoutIMG} alt="logout"/></button>
                
            </div>
          </div>
        </div>
        <div className={isSideBarOpen ? "bg-blur-shown" :"bg-blur-hidden"}/>
        <div className={`sidebar-container ${isSideBarOpen ? "sidebar-container-shown":"sidebar-container-hidden"}`} ref={sideMenuRef}>
          <div className="sidebar-user-info">
            <img src={profilepic} alt="profilepic" onClick={()=>{navigate("/profile")}}/>
            <p>{username}</p>
          </div>
          <div className="sidemenu-buttons">
            <div className="sidebar-separator"/>
            <div className="sidemenu-butt" onClick={()=>navigate(`${project}/activity/`)}>
              Активность
            </div>
            <div className="sidebar-separator"/>
            <div className="sidemenu-butt" onClick={()=>navigate(`${project}/messenger/`)}>
              Мессенджер
            </div>
            <div className="sidebar-separator"/>
            <div className="sidemenu-butt" onClick={()=>navigate(`${project}/info/`)}>
              Информация
            </div>
            <div className="sidebar-separator"/>
            <div className="sidemenu-butt" onClick={()=>navigate(`${project}/kanban/`)}>
              Канбан
            </div>
            <div className="sidebar-separator"/>
            <div className="sidemenu-butt" onClick={()=>navigate(`${project}/settings/`)}>
              Настройки
            </div>
          <div className="sidebar-separator"/>
          </div>
          
        </div>
        <Outlet/>

      </div>
      
    );
  }
  
  export default TopMenuPage ;
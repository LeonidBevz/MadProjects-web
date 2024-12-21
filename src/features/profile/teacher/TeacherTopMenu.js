import React, {useState, useEffect, useRef} from "react";
import SunIMG from "images/sun.svg"
import NightIMG from "images/night.svg"
import LogoutIMG from "images/logout.svg"
import ProfileIMG from "images/profile.svg"
import MenuIMG from "images/menu.svg"
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoIco from "images/logoico";
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";

const TeacherTopMenuPage = () => {
  const {isNightTheme, onThemeChange, isSideBarOpen, setIsSideBarOpen,isWide, isWideRef } = useTheme()
  const navigate = useNavigate()
  const sideMenuRef = useRef()
  const buttonRef = useRef()

  const { handleLogOut, isLoggingOut, role, profileImage, fullName } = useAuth()

  useEffect(()=>{
    if (role === "Common"){
      navigate("/student/profile/")
    }
    // eslint-disable-next-line
  },[role])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current  && buttonRef.current && !isWideRef.current && !(sideMenuRef.current.contains(event.target) || buttonRef.current.contains(event.target))) {
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

  const onSideMenuClick = (goto)=>{
    navigate(goto)
    if (!isWide){
      setIsSideBarOpen(false)    
    }
  }

  const onProfileClick = () =>{
    if (!isWide){
      setIsSideBarOpen(false)    
    }
    navigate("/profile")
  }

  if (isLoggingOut){
    return (<Loading/>)
  }
  
 
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
                <div className="theme-icon-container" onClick={()=>onThemeChange()}>
                    <div className={`theme-icon theme-icon-1 ${isNightTheme ? "theme-icon-hidden-1" : "theme-icon-active"}`}>
                      <img src={SunIMG} alt="sun" />
                    </div>
                    <div className={`theme-icon theme-icon-2 ${isNightTheme ? "theme-icon-active " : "theme-icon-hidden-2"}`}>
                      <img src={NightIMG} alt="night" />
                    </div>
                </div>
                <button className="topmenu-button" onClick={onProfileClick}><img src={ProfileIMG} alt="profile"/></button>
                <button className="topmenu-button" onClick={handleLogOut}><img src={LogoutIMG} alt="logout"/></button>
                
            </div>
          </div>
        </div>
        <div className="page-content">
        <div className={`${isSideBarOpen ? "bg-blur-shown main-bg-blur-shown" :"bg-blur-hidden"} sidemenu-level`}/>
        <div className={`sidebar-container ${isSideBarOpen ? "sidebar-container-shown" : "sidebar-container-hidden"} ${isWide && isSideBarOpen ? "iwWideOpen" :""}`} ref={sideMenuRef}>
            <div className="sidebar-user-info">
              <img src={profileImage} alt="profilepic" onClick={onProfileClick}/>
              <p>{fullName}</p>
            </div>
            <div className="sidemenu-buttons">
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`/teacher/current/`)}>
                Текущие проекты
              </div>
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`/teacher/rate/`)}>
                Выставление оценок
              </div>
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`/teacher/approve/`)}>
                Одобрение проектов
              </div>
              <div className="sidebar-separator"/>
            </div>
          </div>
          <Outlet/>
        </div>

      </div>
      
    );
  }
  
  export default TeacherTopMenuPage;
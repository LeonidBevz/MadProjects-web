import React, {useState, useEffect, useRef} from "react";
import SunIMG from "../../../images/sun.svg"
import NightIMG from "../../../images/night.svg"
import LogoutIMG from "../../../images/logout.svg"
import ProfileIMG from "../../../images/profile.svg"
import MenuIMG from "../../../images/menu.svg"
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useToken from "../../../hooks/useToken";
import LogoIco from "../../../images/logoico";

const TeacherTopMenuPage = () => {
  const {isNightTheme, onThemeChange} = useToken()
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const profilepic = "https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg"
  const username = "Бевз Леонид Александрович"
  const navigate = useNavigate()
  const sideMenuRef = useRef()
  const buttonRef = useRef()
  const isWide = useRef(window.innerWidth>1100)

  const handleResize = () => {
    isWide.current = window.innerWidth > 1100;
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return ()=>{window.removeEventListener('resize', handleResize)}
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current  && buttonRef.current && !isWide.current &&  !(sideMenuRef.current.contains(event.target) || buttonRef.current.contains(event.target))) {
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
    if (!isWide.current){
      setIsSideBarOpen(false)    
    }
  }

  const onProfileClick = () =>{
    setIsSideBarOpen(false)
    navigate("/teacher/profile")
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
                <button className="topmenu-button"><img src={LogoutIMG} alt="logout"/></button>
                
            </div>
          </div>
        </div>
        <div className="page-content">
        <div className={isSideBarOpen ? "bg-blur-shown main-bg-blur-shown" :"bg-blur-hidden"}/>
        <div className={`sidebar-container ${isSideBarOpen ? "sidebar-container-shown" : "sidebar-container-hidden"} ${isWide.current && isSideBarOpen ? "iwWideOpen" :""}`} ref={sideMenuRef}>
            <div className="sidebar-user-info">
              <img src={profilepic} alt="profilepic" onClick={onProfileClick}/>
              <p>{username}</p>
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
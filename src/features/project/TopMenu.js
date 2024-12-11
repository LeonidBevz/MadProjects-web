import React, {useState, useEffect, useRef} from "react";
import SunIMG from "images/sun.svg"
import NightIMG from "images/night.svg"
import LogoutIMG from "images/logout.svg"
import ProfileIMG from "images/profile.svg"
import MenuIMG from "images/menu.svg"
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoIco from "images/logoico";
import "css/topmenu.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";

const TopMenuPage = () => {
  const {isNightTheme, onThemeChange, setIsSideBarPinned} = useTheme()
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const [isWide, setIsWide] = useState(window.innerWidth > 1100)
  const isWideRef = useRef(window.innerWidth > 1100)
  const profilepic = "https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg"
  const username = "Бевз Леонид Александрович"
  const {projectId} = useParams()
  const navigate = useNavigate()
  
  const sideMenuRef = useRef()
  const buttonRef = useRef()

  const { handleLogOut, isLoggingOut } = useAuth()

  const handleResize = () => {
    setIsWide(window.innerWidth > 1100);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return ()=>{window.removeEventListener('resize', handleResize)}
  }, []);

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

  useEffect(()=>{
    if (isWide && isSideBarOpen)
    {
      setIsSideBarPinned(true)
    }
    else{
      setIsSideBarPinned(false)
    }
  },[isWide, isSideBarOpen])

  useEffect(()=>{
    isWideRef.current=isWide
  },[isWide])
  
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
                <button className="topmenu-button" onClick={()=>{navigate("/profile")}}><img src={ProfileIMG} alt="profile"/></button>
                <button className="topmenu-button" onClick={handleLogOut}><img src={LogoutIMG} alt="logout"/></button>
                
            </div>
          </div>
        </div>
        <div className="page-content">
          <div className={isSideBarOpen ? "bg-blur-shown main-bg-blur-shown" :"bg-blur-hidden"}/>
          <div className={`sidebar-container ${isSideBarOpen ? "sidebar-container-shown" : "sidebar-container-hidden"} ${isWideRef.current && isSideBarOpen ? "iwWideOpen" :""}`} ref={sideMenuRef}>
            <div className="sidebar-user-info">
              <img src={profilepic} alt="profilepic" onClick={()=>{navigate("/profile")}}/>
              <p>{username}</p>
            </div>
            <div className="sidemenu-buttons">
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`${projectId}/activity/`)}>
                Активность
              </div>
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`${projectId}/messenger/`)}>
                Мессенджер
              </div>
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`${projectId}/info/`)}>
                Информация
              </div>
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`${projectId}/kanban/`)}>
                Канбан
              </div>
              <div className="sidebar-separator"/>
              <div className="sidemenu-butt" onClick={()=>onSideMenuClick(`${projectId}/settings/`)}>
                Настройки
              </div>
            <div className="sidebar-separator-end"/>
            </div>
          </div>
          <Outlet/>
        </div>

      </div>
      
    );
  }
  
  export default TopMenuPage ;
import React from "react";
import SunIMG from "images/sun.svg"
import NightIMG from "images/night.svg"
import LogoutIMG from "images/logout.svg"
import ProfileIMG from "images/profile.svg"
import LogoIco from "images/logoico";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useAuth } from "features/shared/contexts/AuthContext";
import Loading from "features/shared/components/Loading";

const StudentTopMenuPage = () => {
  const {isNightTheme, onThemeChange} = useTheme()
  const { handleLogOut, isLoggingOut } = useAuth()
  const navigate = useNavigate()

  if (isLoggingOut){
    return (<Loading/>)
  }
  
    return (
      <div className="main-container">          
        <div className="top-menu">
          <div className="sepline"></div>
          <div className="top-menu-content">
            <div className="flex-start"></div>
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
       
        <Outlet/>

      </div>
      
    );
  }
  
  export default StudentTopMenuPage ;
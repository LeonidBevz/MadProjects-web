import React from "react";
import SunIMG from "./../images/sun.svg"
import NightIMG from "./../images/night.svg"
import LogoutIMG from "./../images/logout.svg"
import ProfileIMG from "./../images/profile.svg"
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./topmenu.css"
import LogoIco from "../images/logoico";

const StudentTopMenuPage = () => {
  const {isNightTheme, onThemeChange} = useToken()
  const navigate = useNavigate()
 
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
                <button className="topmenu-button"><img src={LogoutIMG} alt="logout"/></button>
                
            </div>
          </div>
        </div>
       
        <Outlet/>

      </div>
      
    );
  }
  
  export default StudentTopMenuPage ;
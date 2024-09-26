import React, {useState} from "react";
import LogoIMG from "./../images/logo.svg"
import SunIMG from "./../images/sun.svg"
import NightIMG from "./../images/night.svg"
import LogoutIMG from "./../images/logout.svg"
import ProfileIMG from "./../images/profile.svg"
import MenuIMG from "./../images/menu.svg"
import { Outlet } from "react-router-dom";
import "./topmenu.css"

const TopMenuPage = () => {
    const [isNightTheme, setIsNightTheme] = useState(false)
  
    return (
      <div className="main-container">          
        <div className="top-menu">
          <div className="sepline"></div>
          <div className="top-menu-content">
            <div className="flex-start">
              <button className="topmenu-button-left"><img src={MenuIMG} alt="menu"/></button>
            </div>
            <div className="flex-center"><img className="logo" src={LogoIMG} alt="logo"/></div>
            <div className="flex-end">
                <button className="topmenu-button" onClick={()=>{setIsNightTheme(!isNightTheme)}}>
                    <img src={isNightTheme ? NightIMG :SunIMG} alt="theme"/>
                </button>
                <button className="topmenu-button"><img src={ProfileIMG} alt="profile"/></button>
                <button className="topmenu-button"><img src={LogoutIMG} alt="logout"/></button>
                
            </div>
          </div>
        </div>
        <Outlet/>

      </div>
      
    );
  }
  
  export default TopMenuPage ;
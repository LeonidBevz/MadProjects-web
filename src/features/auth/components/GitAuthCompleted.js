import React from "react";
import LogoIco from "images/logoico";
import { useTheme } from "features/shared/contexts/ThemeContext";
import CheckIMG from "images/completedcheck.svg"

const GitAuthSuccessful = ({onSkip}) =>{
    const {isNightTheme} = useTheme()

    return (
       
        <div className="welcome-page">          
        <div className="welcome-container">
            <div className="welcome-image">
                <p>Регистрация</p>
            </div>
            <div className='welcome-right'>
                <LogoIco color={isNightTheme ? "white" : "black"} className="welcome-logo"/>
                <div className='welcome-separator'></div>
                <div className='git-auth-content welcome-content'>
                    
                    <span className="text-git">Успешная авторизация!</span>
                    <img src={CheckIMG} alt="Successful" style={{marginBottom: "20px"}}/>
                    <span className="text-git"> Вы будете автоматически перенаправлены в профиль через 5 секунд.</span>
           
                    <button className="button" onClick={onSkip}>Продолжить</button>
                </div>
            </div>             
        </div>
  </div>
    )
}

export default GitAuthSuccessful
import React from "react";
import LogoIco from 'images/logoico';
import { useTheme } from "features/shared/contexts/ThemeContext";
import GitLogo from "images/gitlogo.svg"

const GitAuthForm = ({onSubmit, onCancel}) =>{
    const {isNightTheme} = useTheme()
   
    return (
        <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>Авторизация GitHub</p>
                </div>
                <div className='welcome-right'>
                    <LogoIco color={isNightTheme ? "white" : "black"} className="welcome-logo"/>
                    <div className='welcome-separator'></div>
                    <div className='git-auth-content welcome-content'>
                        <img className="git-logo" src={GitLogo} alt="GitHub"/>
                        <span className="welcome-text">Для доступа к некоторым функциям сайта требуется авторизация GitHub.</span>                        
                        <button className= "login-but" onClick={onSubmit}>Авторизовать</button>
                        <button className="skip-button" onClick={onCancel}>Пропустить</button>
                    
                    </div>
                </div>             
            </div>
      </div>
    )
}

export default GitAuthForm
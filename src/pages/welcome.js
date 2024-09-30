import React from 'react';
import { useNavigate} from 'react-router-dom';
import useToken from '../hooks/useToken';
import "./login.css"
import LogoIco from '../images/logoico';

const WelcomePage = () => {
    const navigate = useNavigate()
    const {isNightTheme} = useToken()
   
    return (
      <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>Добро пожаловать!</p>
                </div>
                <div className='welcome-right'>
                    <LogoIco color={isNightTheme ? "white" : "black"} className="welcome-logo"/>
                    <div className='welcome-separator'></div>
                    <div className='welcome-content'>
                        <p className='welcome-text'>Чтобы создать проект или присоединиться к уже существующему войдите или зарегистрируйтесь. </p>
                        <div className='welcome-but-container'>
                            <button onClick={()=>{navigate("/login")}}>Вход</button>
                            <button onClick={()=>{navigate("/register")}}>Регистрация</button>
                        </div>
                    </div>
                </div>
                
               
                
            </div>
      </div>
      
    );
  }
  
  export default WelcomePage;
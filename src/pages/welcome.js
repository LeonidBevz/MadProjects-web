import React from 'react';
import { useNavigate} from 'react-router-dom';
import LogoIMG from "./../images/logo.svg"
import "./login.css"

const WelcomePage = () => {
    const navigate = useNavigate()
   
    return (
      <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>Добро пожаловать!</p>
                </div>
                <div className='welcome-right'>
                    <img className='welcome-logo'alt='logo' src={LogoIMG}/>
                    <div className='welcome-separator'></div>
                    <div className='welcome-content'>
                        <div className='welcome-text'>Чтобы создать проект или присоединиться к уже существующему войдите или зарегистрируйтесь. </div>
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
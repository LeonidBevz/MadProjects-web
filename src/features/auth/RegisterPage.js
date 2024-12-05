import React, { useState} from 'react';
import LogoIco from 'images/logoico';
import StudentForm from 'features/auth/components/StudentForm';
import ProfessorForm from 'features/auth/components/ProfessorForm';
import "css/login.css"
import { useTheme } from 'features/shared/contexts/ThemeContext';
import EmailConfirm from './components/EmailConfirmForm';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    
    const [isEmailConfirm, setIsEmailConfirm] = useState(false)
    const {isNightTheme} = useTheme()
    const [isProfessor, setIsProfessor] = useState(false)
    
    const [studentForm, setStudentForm] = useState({
        surname: "",
        name: "",
        iname: "",
        group: "",
        email: "",
        gitlink: "",
        password: ""
    })

    const [professorForm, setProfessorForm] = useState({
        surname: "",
        name: "",
        iname: "",
        email: "",
        rank: "",
        password: ""
    })

    const handleSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(true)
    } 
    const handleEmailSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(false)
        setErrorMessage("Бека нет")
    } 
  

    return (
      <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>{isProfessor ? "Регистрация преподаватель" : "Регистрация студент"}</p>
                    {!isEmailConfirm && (<div className='welcome-selector'>
                        <button className={isProfessor ? "" :"studentb"} onClick={()=>setIsProfessor(false)}>Студент</button>
                        <button className={isProfessor ? "professorb" :""} onClick={()=>setIsProfessor(true)}>Преподаватель</button>
                    </div>)}
                </div>
                <div className='welcome-right'>
                    <LogoIco color={isNightTheme ? "white" : "black"} className="welcome-logo"/>
                    <div className='welcome-separator'></div>
                    <div className='welcome-content'>
                        {isEmailConfirm && !isProfessor&& (<EmailConfirm data={studentForm} onSubmit={handleEmailSubmit}/>)}
                        {isEmailConfirm && isProfessor && (<EmailConfirm data={professorForm} onSubmit={handleEmailSubmit}/>)}
                        {!isEmailConfirm && !isProfessor && (<StudentForm studentForm={studentForm} setStudentForm={setStudentForm} errorMessage={errorMessage} handleSubmit={handleSubmit}/>)}
                        {!isEmailConfirm && isProfessor && (<ProfessorForm professorForm={professorForm} setProfessorForm={setProfessorForm} errorMessage={errorMessage} handleSubmit={handleSubmit}/>)}
                        <span className="switch-reg-mode">{isProfessor ? "Регистрация для студентов " : "Регистрация для преподавателей "} <span className='linkspan' onClick={()=>setIsProfessor(!isProfessor)}>тут</span></span>                       
                    </div>
                </div>             
                
            </div>
      </div>
      
    );
  }
  
  export default RegisterPage;
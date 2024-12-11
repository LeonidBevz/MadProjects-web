import React, { useEffect, useState} from 'react';
import LogoIco from 'images/logoico';
import StudentForm from 'features/auth/components/StudentForm';
import ProfessorForm from 'features/auth/components/ProfessorForm';
import "css/login.css"
import { useTheme } from 'features/shared/contexts/ThemeContext';
import EmailConfirm from './components/EmailConfirmForm';
import { useRegister } from './hooks/useAuth';
import PolicyModal from './components/PrivacyPolicy';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    
    const [isEmailConfirm, setIsEmailConfirm] = useState(false)
    const {isNightTheme} = useTheme()
    const [isProfessor, setIsProfessor] = useState(false)
    const [policyMode, setPolicyMode] = useState(0)
    
    const [studentForm, setStudentForm] = useState({
        username: "",
        surname: "",
        name: "",
        iname: "",
        group: "",
        email: "",
        password: ""
    })

    const [professorForm, setProfessorForm] = useState({
        username: "",
        surname: "",
        name: "",
        iname: "",
        email: "",
        rank: "",
        password: ""
    })

    const { mutate, data, isLoading, error, isSuccess } = useRegister();

    const handleSubmit = () =>{
        if (isProfessor){
            mutate({
                username: professorForm.username,
                firstname: professorForm.name,
                secondname: professorForm.surname,
                lastName: professorForm.iname,
                email: professorForm.email,
                password: professorForm.password
            })
        }
        else{
            mutate({
                username: studentForm.username,
                firstname: studentForm.name,
                secondname: studentForm.surname,
                lastName: studentForm.iname,
                group: studentForm.group,
                email: studentForm.email,
                password: studentForm.password
            })
        }
       
    } 
    useEffect(()=>{
        if (!error) return
        switch (error.status){
            default:
                setErrorMessage("Что-то пошло не так. Код ошибки " + error.status );
        }
    },[error])
    
    useEffect(()=>{
        if (!isSuccess) return
        setIsEmailConfirm(true)
    },[isSuccess])

    useEffect(()=>{
        setErrorMessage("")
    },[isProfessor])

    const handleEmailSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(false)
        if (!data.id){
            setErrorMessage("Что-то пошло сильно не так")
        }
        else{
            navigate(`/git/auth?code=&state=${data.id}`)
        }
        
    } 
  

    return (
      <div className="welcome-page">
        <div className={policyMode > 0 ? "bg-blur-shown" :"bg-blur-hidden"}/>
        {policyMode > 0 && <PolicyModal policyMode={policyMode} onCancel={()=>{setPolicyMode(0)}}/>}         
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
                        {!isEmailConfirm && !isProfessor && (<StudentForm studentForm={studentForm} setStudentForm={setStudentForm} errorMessage={errorMessage} setErrorMessage={setErrorMessage} onSubmit={handleSubmit} isLoading={isLoading} setPolicyMode={setPolicyMode}/>)}
                        {!isEmailConfirm && isProfessor && (<ProfessorForm professorForm={professorForm} setProfessorForm={setProfessorForm} errorMessage={errorMessage} setErrorMessage={setErrorMessage} onSubmit={handleSubmit} isLoading={isLoading} setPolicyMode={setPolicyMode}/>)}
                        <span className="switch-reg-mode">{isProfessor ? "Регистрация для студентов " : "Регистрация для преподавателей "} <span className='linkspan' onClick={()=>setIsProfessor(!isProfessor)}>тут</span></span>                       
                    </div>
                </div>             
                
            </div>
      </div>
      
    );
  }
  
  export default RegisterPage;
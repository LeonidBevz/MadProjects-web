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
                firstName: professorForm.name,
                secondName: professorForm.iname, 
                lastName: professorForm.surname,
                email: professorForm.email,
                password: professorForm.password,
                data: professorForm.rank,
                userType: "Curator"
            })
        }
        else{
            mutate({
                username: studentForm.username,
                firstName: studentForm.name,
                secondName: studentForm.iname,
                lastName: studentForm.surname,
                email: studentForm.email,
                password: studentForm.password,
                data: studentForm.group,
                userType: "Common"
            })
        }
       
    } 
    useEffect(()=>{
        if (!error) return
        switch (error.status){
            case 403:
                setErrorMessage("Слабый пароль!")
                return
            case 409:
                setErrorMessage("Пользователь с таким email уже зарегистрирован!")
                return
            case 406:
                setErrorMessage("Такой username уже занят!")
                return
            default:
                setErrorMessage("Что-то пошло не так. Код ошибки " + error.status );
        }
    },[error])
    
    useEffect(()=>{
        if (!isSuccess) return
        navigate(`/git/auth?code=&state=${data.token}`)
        //подтверждение почты
        //setIsEmailConfirm(true)
    },[isSuccess])

    useEffect(()=>{
        setErrorMessage("")
    },[isProfessor])

    const handleEmailSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(false)
    } 
  

    return (
      <div className="welcome-page register-page">
        <div className={`${policyMode > 0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
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
import React, { useState} from 'react';
import LogoIco from '../../images/logoico';
import useToken from '../../hooks/useToken';
import StudentForm from '../../components/studentform';
import ProfessorForm from '../../components/professorform';
import "../../css/login.css"

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [code, setCode] = useState('');
    const [isEmailConfirm, setIsEmailConfirm] = useState(false)
    const {isNightTheme} = useToken()
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

    const handleStudentSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(true)
    } 
    const handleEmailSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(false)
        setErrorMessage("Бека нет")
    } 
    
    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

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
                        {isEmailConfirm && (
                            <>
                                <p>{`На почту ${isProfessor ? professorForm.email : studentForm.email} отправлено письмо подтверждения.`}</p>
                                <label>Введите код из письма: </label>
                                <form onSubmit={handleEmailSubmit}>
                                    <div>
                                        <input
                                            placeholder="Код подтверждения"
                                            type="code"
                                            id="code"
                                            name="code"
                                            value={code}
                                            onChange={handleCodeChange}
                                            maxLength={5}
                                            required
                                        />
                                    </div>
                                    <button className= "login-but" type="submit">Подтвердить</button>
                                </form>
                            </>
                        )}
                        {!isEmailConfirm && !isProfessor && (<StudentForm studentForm={studentForm} setStudentForm={setStudentForm} errorMessage={errorMessage} handleSubmit={handleStudentSubmit}/>)}
                        {!isEmailConfirm && isProfessor && (<ProfessorForm professorForm={professorForm} setProfessorForm={setProfessorForm} errorMessage={errorMessage} />)}
                        <span className="switch-reg-mode">{isProfessor ? "Регистрация для студентов " : "Регистрация для преподавателей "} <span className='linkspan' onClick={()=>setIsProfessor(!isProfessor)}>тут</span></span>                       
                    </div>
                </div>             
                
            </div>
      </div>
      
    );
  }
  
  export default RegisterPage;
import React, {useState} from "react";
import LogoIco from 'images/logoico';
import { useTheme } from "features/shared/contexts/ThemeContext";
import Loading from "features/shared/components/Loading";

const LoginForm = ({onSubmit, errorMessage, isLoading}) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    

    const {isNightTheme} = useTheme()

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) =>{
        event.preventDefault();
        onSubmit({email: email, password: password})
    }

    return (
        <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>Вход</p>
                </div>
                <div className='welcome-right'>
                    <LogoIco color={isNightTheme ? "white" : "black"} className="welcome-logo"/>
                    <div className='welcome-separator'></div>
                    <div className='welcome-content'>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    placeholder="Email"
                                    autoComplete='username'
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    maxLength={64}
                                    required
                                />
                            </div>
                            <div className='last-input'>
                                <label htmlFor="password">Пароль</label>
                                <input
                                    placeholder="Пароль"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    maxLength={32}
                                    minLength={10}
                                    required
                                />
                            </div>
                            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
                            {!isLoading && (<button className= "login-but" type="submit">Войти</button>)}
                            {isLoading && (<Loading/>)}
                            <span style={{display:"block", marginTop: "1rem"}} className="new-user">Возникли вопросы? Ответим <a target="_blank" href="https://mad-projects.ru:8080/inst">тут</a></span>
                            <span style={{display:"block", marginTop: "0.5rem"}} className="new-user">Новый пользователь? <a href="/register/">Регистрация</a></span>
                        </form>
                    </div>
                </div>             
            </div>
      </div>
    )
}

export default LoginForm
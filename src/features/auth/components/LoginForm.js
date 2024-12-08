import React, {useState} from "react";
import LogoIco from 'images/logoico';
import { useTheme } from "features/shared/contexts/ThemeContext";

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
                                    maxLength={64}
                                    minLength={8}
                                    required
                                />
                            </div>
                            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
                            <button className= "login-but" type="submit">Войти</button>
                            <p className="new-user">Новый пользователь? <a href="/register/">Регистрация</a></p>
                        </form>
                    </div>
                </div>             
            </div>
      </div>
    )
}

export default LoginForm
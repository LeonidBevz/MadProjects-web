import React, {useState} from 'react';
import LogoIMG from "./../images/logo.svg"
import "./login.css"

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) =>{
        event.preventDefault();
        setErrorMessage("Бека нет")
    } 
     const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
      <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>Вход</p>
                </div>
                <div className='welcome-right'>
                    <img className='welcome-logo'alt='logo' src={LogoIMG}/>
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
      
    );
  }
  
  export default LoginPage;
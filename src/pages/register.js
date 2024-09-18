import React, {useState} from 'react';
import LogoIMG from "./../images/logo.svg"
import "./login.css"

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [gitlink, setGitLink] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [isEmailConfirm, setIsEmailConfirm] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegSubmit = (event) =>{
        event.preventDefault();
        if (password!==confirmPassword){
            setErrorMessage("Пароли не совпадают!")
            return
        }
        if (password.length<5){
            setErrorMessage("Пароль должен содержать минимум 5 символов!")
            return
        }
        setIsEmailConfirm(true)
    } 
    const handleEmailSubmit = (event) =>{
        event.preventDefault();
        setIsEmailConfirm(false)
        setErrorMessage("Бека нет")
    } 
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handleGitlinkChange = (event) => {
        setGitLink(event.target.value);
    };
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };
    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    return (
      <div className="welcome-page">          
            <div className="welcome-container">
                <div className="welcome-image">
                    <p>Регистрация</p>
                </div>
                <div className='welcome-right'>
                    <img className='welcome-logo'alt='logo' src={LogoIMG}/>
                    <div className='welcome-separator'></div>
                    <div className='welcome-content'>
                        {isEmailConfirm && (
                            <>
                                <p>{`На почту ${email} отправлено письмо подтверждения.`}</p>
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
                        {!isEmailConfirm && (
                          <form onSubmit={handleRegSubmit}>
                            <div>
                                <label htmlFor="username">Имя пользователя</label>
                                <input
                                    placeholder="Имя пользователя"
                                    type="username"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    maxLength={64}
                                    required
                                />
                            </div>
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
                            <div>
                                <label htmlFor="gitlink">Ссылка на GitHub</label>
                                <input
                                    placeholder="Ссылка на GitHub"
                                    type="gitlink"
                                    id="gitlink"
                                    name="gitlink"
                                    value={gitlink}
                                    onChange={handleGitlinkChange}
                                    maxLength={64}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Пароль</label>
                                <input
                                    placeholder="Пароль"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    maxLength={64}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password">Подтвердите пароль</label>
                                <input
                                    placeholder="Подтвердите пароль"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    maxLength={64}
                                    required

                                />
                            </div>
                            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
                            <button className= "login-but" type="submit">Зарегистрироваться</button>
                            <p className="new-user">Уже есть аккаунт? <a href="/login/">Войти</a></p>
                          </form>
                        )}
                       
                    </div>
                </div>             
                
            </div>
      </div>
      
    );
  }
  
  export default RegisterPage;
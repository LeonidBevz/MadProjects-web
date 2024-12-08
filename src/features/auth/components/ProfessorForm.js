import PasswordEye from "images/PassEye";
import React, {useState} from "react";
import { useTheme } from "features/shared/contexts/ThemeContext";
import Loading from "features/shared/components/Loading";

const ProfessorForm = ({errorMessage, onSubmit, professorForm, setProfessorForm, setErrorMessage, isLoading, setPolicyMode}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isPolicyChecked, setIsPolicyChecked] = useState(false);
    const {isNightTheme} = useTheme()

    const validatePassword = (password) => ({
        minLength: password.length >= 12,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!"#$%&'()*+,-./:;<=>?@^_`{|}~]/.test(password),
    });

    const validation = validatePassword(professorForm.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfessorForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (event) =>{
        event.preventDefault()
        if (!Object.values(validation).every((isValid) => isValid)) {
            setErrorMessage("Слабый пароль")
            return
        }
        if (!isPolicyChecked){
            setErrorMessage("Пожалуйста, подтвердите согласие с условиями использования!")
            return
        }
        onSubmit()
    }
    const handleCheckboxChange = (event) => {
        setIsPolicyChecked(event.target.checked);
    };
  
    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="username">Имя пользователя *</label>
            <input
                placeholder="Имя пользователя"
                id="username"
                name="username"
                value={professorForm.username}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="surname">Фамилия *</label>
            <input
                placeholder="Фамилия"
                id="surname"
                name="surname"
                value={professorForm.surname}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="name">Имя *</label>
            <input
                placeholder="Имя"
                id="name"
                name="name"
                value={professorForm.name}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="iname">Отчество *</label>
            <input
                placeholder="Отчество"
                id="iname"
                name="iname"
                value={professorForm.iname}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="rank">Учебная степень, звание</label>
            <input
                placeholder="Учебная степень"
                id="rank"
                name="rank"
                value={professorForm.rank}
                onChange={handleChange}
                maxLength={64}
            />
        </div>
        <div>
            <label htmlFor="email">Email *</label>
            <input
                placeholder="Email"
                autoComplete='username'
                type="email"
                id="email"
                name="email"
                value={professorForm.email}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        
        <div className="password-container">
            <div className="flex-pass">
                <label htmlFor="password">Пароль *</label>
                <PasswordEye 
                        className="eye-icon"
                        onClick={()=>setIsPasswordVisible(prev=>{return !prev})} 
                        color={isNightTheme ? "white" : "black"} 
                        isPasswordVisible={isPasswordVisible}
                />
            </div>
            <input
                className="password-input"
                placeholder="Пароль"
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={professorForm.password}
                onChange={handleChange}
                maxLength={64}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                required
            />
               
            {showTooltip && (
            <div className="password-tooltip">
              <ul>
                <li style={{ color: validation.minLength ? 'green' : 'red' }}>
                  Длина не менее 12 символов
                </li>
                <li style={{ color: validation.hasUppercase ? 'green' : 'red' }}>
                  Содержит строчные и прописные буквы (a-Z)
                </li>
                <li style={{ color: validation.hasNumber ? 'green' : 'red' }}>
                  Содержит хотя бы одну цифру
                </li>
                <li style={{ color: validation.hasSpecialChar ? 'green' : 'red' }}>
                  Содержит специальный символ (@, #, $)
                </li>
              </ul>
            </div>
        )}
        </div>
        <div>
            <div className="flex-agree">
                <span>Я ознакомился и согласен с
                    <span className="politics-link" onClick={()=>{setPolicyMode(1)}}> политикой конфиденциальности</span> и 
                    <span className="politics-link" onClick={()=>{setPolicyMode(2)}}> правилами пользования </span>
                </span>
                <label className="checkbox-label">
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={isPolicyChecked}
                        onChange={handleCheckboxChange}
                    />
                    <span/>
                </label>
            </div>
        </div>
        {errorMessage && (<p className="error-message">{errorMessage}</p>)}
        {isLoading && (<Loading/>)}
        {!isLoading && (<button className= "login-but" type="submit">Зарегистрироваться</button>)}
        <p className="new-user">Уже есть аккаунт? <a href="/login/">Войти</a></p>
      </form>
    );
}
  
export default ProfessorForm;

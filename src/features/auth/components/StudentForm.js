import React, {useState} from "react";
import { useTheme } from "features/shared/contexts/ThemeContext";
import PasswordEye from "images/PassEye";
import Loading from "features/shared/components/Loading";


const StudentForm = ({errorMessage, setErrorMessage, onSubmit, studentForm, setStudentForm,isLoading, setPolicyMode}) => {
   
    const [showTooltip, setShowTooltip] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const {isNightTheme} = useTheme()
    const [isPolicyChecked, setIsPolicyChecked] = useState(false);

    const validatePassword = (password) => ({
        minLength: password.length >= 10,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!"#$%&'()*+,-./:;<=>?@^_`{|}~]/.test(password),
    });

    const validation = validatePassword(studentForm.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentForm((prevForm) => ({
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
                value={studentForm.username}
                onChange={handleChange}
                maxLength={24}
                required
            />
        </div>
        <div>
            <label htmlFor="surname">Фамилия *</label>
            <input
                placeholder="Фамилия"
                id="surname"
                name="surname"
                value={studentForm.surname}
                onChange={handleChange}
                maxLength={24}
                required
            />
        </div>
        <div>
            <label htmlFor="name">Имя *</label>
            <input
                placeholder="Имя"
                id="name"
                name="name"
                value={studentForm.name}
                onChange={handleChange}
                maxLength={24}
                required
            />
        </div>
        <div>
            <label htmlFor="iname">Отчество *</label>
            <input
                placeholder="Отчество"
                id="iname"
                name="iname"
                value={studentForm.iname}
                onChange={handleChange}
                maxLength={24}
                required
            />
        </div>
        <div>
            <label htmlFor="group">Группа *</label>
            <input
                placeholder="Группа"
                id="group"
                name="group"
                value={studentForm.group}
                onChange={handleChange}
                maxLength={24}
                required
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
                value={studentForm.email}
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
                value={studentForm.password}
                onChange={handleChange}
                maxLength={32}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                required
            />
            {showTooltip && (
            <div className="password-tooltip">
              <ul>
                <li style={{ color: validation.minLength ? 'green' : 'red' }}>
                  Длина не менее 10 символов
                </li>
                <li style={{ color: validation.hasUppercase && validation.hasLowercase ? 'green' : 'red' }}>
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
  
export default StudentForm;

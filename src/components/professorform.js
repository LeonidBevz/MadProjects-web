import React from "react";

const ProfessorForm = ({errorMessage, handleSubmit = ()=>{}, professorForm, setProfessorForm}) => {
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfessorForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };
  
    return (
        <form onSubmit={handleSubmit}>
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
        
        <div>
            <label htmlFor="password">Пароль *</label>
            <input
                placeholder="Пароль"
                type="password"
                id="password"
                name="password"
                value={professorForm.password}
                onChange={handleChange}
                maxLength={64}
                minLength={8}
                required
            />
        </div>
        
        {errorMessage && (<p className="error-message">{errorMessage}</p>)}
        <button className= "login-but" type="submit">Зарегистрироваться</button>
        <p className="new-user">Уже есть аккаунт? <a href="/login/">Войти</a></p>
      </form>
    );
}
  
export default ProfessorForm;

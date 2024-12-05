import React from "react";

const StudentForm = ({errorMessage, handleSubmit = ()=>{}, studentForm, setStudentForm}) => {
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };
    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="surname">Фамилия</label>
            <input
                placeholder="Фамилия"
                id="surname"
                name="surname"
                value={studentForm.surname}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="name">Имя</label>
            <input
                placeholder="Имя"
                id="name"
                name="name"
                value={studentForm.name}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="iname">Отчество</label>
            <input
                placeholder="Отчество"
                id="iname"
                name="iname"
                value={studentForm.iname}
                onChange={handleChange}
                maxLength={64}
                required
            />
        </div>
        <div>
            <label htmlFor="group">Группа</label>
            <input
                placeholder="Группа"
                id="group"
                name="group"
                value={studentForm.group}
                onChange={handleChange}
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
                value={studentForm.email}
                onChange={handleChange}
                maxLength={64}
                required

            />
        </div>
        <div>
            <label htmlFor="gitlink">Ссылка на GitHub</label>
            <input
                placeholder="Ссылка на GitHub"
                id="gitlink"
                name="gitlink"
                value={studentForm.gitlink}
                onChange={handleChange}
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
                value={studentForm.password}
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
  
export default StudentForm;

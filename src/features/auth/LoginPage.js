import React, { useState, useEffect } from 'react';
import { useLogin } from './hooks/useAuth';

import "css/login.css"
import LoginForm from './components/LoginForm';

const LoginPage = () => {
    const { mutate, isLoading, error } = useLogin();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (data) =>{    
        mutate(data);
    } 

    useEffect(()=>{
        if (!error) return
        switch (error.status){
            case 401:
                setErrorMessage("Пользователь не зарегистрирован.");
                break;
            default:
                setErrorMessage("Что-то пошло не так. Код ошибки " + error.status );
        }
    },[error])
  
    return (
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage}/>
    );
  }
  
  export default LoginPage;
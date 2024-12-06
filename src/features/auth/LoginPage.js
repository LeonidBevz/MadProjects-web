import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'features/shared/contexts/AuthContext';
import { useApi } from 'features/shared/contexts/ApiContext';
import { useWebSocket } from 'features/shared/contexts/WebSocketContext';

import "css/login.css"
import LoginForm from './components/LoginForm';

const LoginPage = () => {
    const navigate = useNavigate()

    const { iswsConnected } = useWebSocket()
    const { saveUserData } = useAuth()
    const api = useApi()

    const handleSubmit = (event) =>{
        event.preventDefault();
        saveUserData({name: "", id: 1})

        const fetchData = async () => {
            try {           
              console.log(api, "z")
              const response = await api.post(`/api/account/login/`, {
                email: 'goool@123',
                password: '123'
              })
            console.log(response)    
            } catch (error) {
              console.error('Ошибка при получении данных:', error);
              return null;
            }
          };
          fetchData()

        navigate("/profile/")
    } 
    
    if(iswsConnected){//waiting socket to disconnect
        <div>Wait, Logging out</div>
    }
    return (
        <LoginForm onSubmit={handleSubmit}/>
    );
  }
  
  export default LoginPage;
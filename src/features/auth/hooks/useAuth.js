import { useMutation } from 'react-query';
import { registerUser, loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'features/shared/contexts/AuthContext';

export const useRegister = () => {
  const {saveAccessToken, saveUserData} = useAuth()
  
  return useMutation(registerUser,{
    onSuccess: (data) => {
        saveAccessToken(data.token)
        saveUserData(data)
      }
  });
};

export const useLogin = () => {
  const {saveAccessToken, saveUserData} = useAuth()
  const navigate = useNavigate();

  return useMutation(loginUser,{
    onSuccess: (data) => {
        saveAccessToken(data.token)
        saveUserData(data)
        navigate("/profile/")
      },    
      onError: (error) => {
        console.error('Login error:', error);
      },
  });
};

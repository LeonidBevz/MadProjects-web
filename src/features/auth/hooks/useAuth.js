import { useMutation } from 'react-query';
import { registerUser, loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'features/shared/contexts/AuthContext';

export const useRegister = () => {
  const {saveAccessToken, saveRole, saveTokenTime} = useAuth()
  
  return useMutation(registerUser,{
    onSuccess: (data) => {
        saveAccessToken(data.token)
        saveRole(data.userType)
        saveTokenTime(data.expiresAt)
      }
  });
};

export const useLogin = () => {
  const {saveAccessToken, saveRole, saveTokenTime} = useAuth()
  const navigate = useNavigate();

  return useMutation(loginUser,{
    onSuccess: (data) => {
        saveAccessToken(data.token)
        saveRole(data.userType)
        saveTokenTime(data.expiresAt)
        navigate("/profile/")
      }
  });
};

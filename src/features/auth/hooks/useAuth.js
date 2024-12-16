import { useMutation } from 'react-query';
import { registerUser, loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  
  return useMutation(registerUser,{
    onSuccess: (data) => {
      localStorage.setItem("access", data.token);
      localStorage.setItem("role", data.userType)
      localStorage.setItem("tokenTime", data.expiresAt);
    }
  });
};

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation(loginUser,{
    onSuccess: (data) => {
      localStorage.setItem("access", data.token);
      localStorage.setItem("role", data.userType)
      localStorage.setItem("tokenTime", data.expiresAt);
      navigate("/profile/")      
    }
  });
};

import { useMutation } from 'react-query';
import { registerUser, loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  
  return useMutation(registerUser,{
    onSuccess: (data) => {
      localStorage.setItem("access", data.accessToken);
      localStorage.setItem("refresh", data.refreshToken);
      localStorage.setItem("role", data.userType)
      localStorage.setItem("accessTime", data.accessExpiresAt);
      localStorage.setItem("refreshTime", data.refreshExpiresAt);
    }
  });
};

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation(loginUser,{
    onSuccess: (data) => {
      localStorage.setItem("access", data.accessToken);
      localStorage.setItem("refresh", data.refreshToken);
      localStorage.setItem("role", data.userType)
      localStorage.setItem("accessTime", data.accessExpiresAt);
      localStorage.setItem("refreshTime", data.refreshExpiresAt);
      navigate("/profile/")      
    }
  });
};

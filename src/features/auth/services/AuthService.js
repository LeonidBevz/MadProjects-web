import axios from "axios";
import { BackURL } from "urls";


export const registerUser = async (userData) => {
  const response = await axios.post(BackURL + '/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(BackURL + '/auth/login', credentials);
  return response.data;
};


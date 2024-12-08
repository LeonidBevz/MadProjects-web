import axios from "axios";
import { BackURL } from "urls";


export const registerUser = async (userData) => {
  const response = await axios.post(BackURL + '/api/account/register/', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(BackURL + '/api/account/login/', credentials);
  return response.data;
};


import api from "features/shared/services/apiClient";

export const getStudentProfile = async () => {
  const response = await api.get('/commonProfile');
  return response.data;
};




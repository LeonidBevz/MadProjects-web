import api from "features/shared/services/apiClient";

export const getStudentProfile = async () => {
  const response = await api.get('/commonProfile');
  return response.data;
};

export const getProfessorsList = async () => {
  const response = await api.get('/project/curators')
  return response.data;
}

export const verifyRepoLink = async (repoLink) =>{
  const response = await api.get('/github/verifyRepoLink?repolink=' + repoLink)
  return response.data;
}

export const createProject = async (data) =>{
  const response = await api.post('/project/create', data)
  return response.data;
}

export const getSharedUser = async () =>{
  const response = await api.get("/sharedProfile")
  return response.data;
} 




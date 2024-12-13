import api from "features/shared/services/apiClient";

export const getReposList = async (userData) => {
  const response = await api.get("/github/getProjectRepoBranches?projectId=" + userData.projectId);
  return response.data;
};

export const getRepoData = async (data) => {
  const response = await api.get('/github/getRepoBranchContent?sha=' + data.sha + "&repoName=" + data.repoName);
  return response.data;
};


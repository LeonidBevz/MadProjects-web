import api from "features/shared/services/apiClient";

export const getProjectMeta = async (projectId) => {
  const response = await api.get("/project/get?=projectId=" + projectId);
  return response.data;
};

export const postUpdateProject = async (data) => {
  const response = await api.post("/project/update", data);
  return response.data;
};



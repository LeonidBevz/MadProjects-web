import api from "features/shared/services/apiClient";

export const getProjectsStatuses = async (groupId) => {
    const response = await api.get("/analytics/projectStatuses", {
        params: { groupId },
    });
  return response.data;
};

export const getProjectsCommits = async (groupId) => {
    const response = await api.get("/analytics/projectGroupCommits", {
        params: { groupId },
    });
  return response.data;
};

export const getProjectsMarks = async (groupId) => {
    const response = await api.get("/analytics/projectGroupMarks", {
        params: { groupId },
    });
  return response.data;
};

export const getUserCommits = async (projectId) => {
    const response = await api.get("/analytics/userCommits", {
        params: { projectId },
    });
  return response.data;
};




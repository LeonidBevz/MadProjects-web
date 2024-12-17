import api from "features/shared/services/apiClient";

export const getProjectMeta = async (projectId) => {
  const response = await api.get("/project/get?=projectId=" + projectId);
  return response.data;
};

export const postUpdateProject = async (data) => {
  const response = await api.post("/project/update", data);
  return response.data;
};

export const addRepo = async (data) =>{
  const response = await api.post("/project/repo/add?projectId=" + data.projectId+ "&repoLink="+ data.repoLink);
  return response.data;
}

export const getInviteCode = async (projectId) =>{
  const response = await api.get("/invites/get?projectId=" + projectId );
  return response.data;
}

export const deleteRepo = async (data) =>{
  const response = await api.post("/project/repo/remove?projectId=" + data.projectId+"&repoId=" + data.repoId );
  return response.data;
}

export const deleteMember = async (data) =>{
  const response = await api.post("/project/member/remove?projectId=" + data.projectId+"&memberId=" + data.memberId );
  return response.data;
}


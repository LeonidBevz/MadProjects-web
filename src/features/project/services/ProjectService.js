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

export const deleteProject = async (data) =>{
  const response = await api.post("/project/delete?projectId=" + data.projectId);
  return response.data;
}

export const getLastActivities = async (projectId, count) =>{
  const response = await api.get("/project/activity/get?projectId=" + projectId + "&count=" +count );
  return response.data;
}

export const getProjectSprints = async (projectId) =>{
  const response = await api.get("/sprint/getListByProject?projectId=" + projectId);
  return response.data;
}

export const createSprint = async (data) =>{
  const response = await api.post("/sprint/create", data);
  return response.data;
}

export const getProjectKards = async (projectId) =>{
  const response = await api.get("/project/kards?projectId=" + projectId);
  return response.data;
}

export const getSprint = async (sprintId) =>{
  const response = await api.get("/sprint/get?sprintId=" + sprintId);
  return response.data;
}

export const updateSprint = async (data) =>{
  const response = await api.post("/sprint/update", data);
  return response.data;
}

export const finishSprint = async (sprintId) =>{
  const response = await api.post("/sprint/finish?sprintId=" +  sprintId);
  return response.data;
}

export const rateProject = async (data) =>{
  const response = await api.post("/project/mark/set?projectId=" + data.projectId + "&mark=" + data.mark);
  return response.data;
}

export const retrySubmission = async (data) => {
  const response = await api.post("/curatorship/retrySubmission?projectId=" + data.projectId );
  return response.data;
}


export const createChat = async (data) => {
  const response = await api.post("/project/createKardChat?kardId=" + data.kardId + "&projectId=" + data.projectId );
  return response.data;
}
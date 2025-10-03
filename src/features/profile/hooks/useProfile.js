import { useQuery, useMutation } from "react-query";
import { getStudentProfile, getProfessorsList, verifyRepoLink, createProject, getSharedUser, getTeacherProfile, createProjectsGroup, getGroupProjects, editCommonProfile, getCouratorGroups, joinProject, getPendingProjects, approveProject, disapproveProject, getUnmarkedProjects, editTeacherProfile, getUserById, getCouratorGroupsJwt, getStudyGroups, getAllProjects, deletePGroup } from "../services/profileService";
import { useAuth } from "features/shared/contexts/AuthContext";

export const useGetStudentProfile = () => {
  const { accessToken } = useAuth()
  return useQuery(
    ["fetchStudentProfile", accessToken],
    () => getStudentProfile(),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetTeacherProfile = () => {
  const { accessToken } = useAuth()
  return useQuery(
    ["fetchTeacherProfile", accessToken],
    () => getTeacherProfile(),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetProfessors = () => {
  return useQuery(
    ["fetchProfessors"],
    () => getProfessorsList(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export const useVerifyRepo = () => {
  return useMutation(verifyRepoLink);
}

export const useCreateProject = () => {
  return useMutation(createProject);
}

export const useGetSharedUser = (access) =>{
  return useQuery(
    ["fetchSharedUser", access],
    () => getSharedUser(),
    {
      enabled: !!access,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}
export const useGetUserById = (id) =>{
  return useQuery(
    ["fetchUserById", id],
    () => getUserById(id),
    {
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useEditCommonProfile = () =>{
  return useMutation(editCommonProfile);
}

export const useCreateProjectsGroup = () => {
  return useMutation(createProjectsGroup);
}

export const useGetGroupProjects = (id) =>{
  return useQuery(
    ["fetchGroupProjects", id],
    () => getGroupProjects(id),
    {
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useGetCuratorGroups = (id) =>{
  return useQuery(
    ["fetchCouratorGroups", id],
    () => getCouratorGroups(id),
    {
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useGetCuratorGroupsJwt = (options ={}) =>{
  return useQuery(
    ["fetchCouratorGroupsJwt"],
    () => getCouratorGroupsJwt(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
}

export const useGetStudyGroups = (id) =>{
  return useQuery(
    ["fetchStudyGroups", id],
    () => getStudyGroups(id),
    {
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useJoinProject = () => {
  return useMutation(joinProject);
}


export const useGetPendingProjects = () =>{
  return useQuery(
    ["fetchPendingProjects"],
    () => getPendingProjects(),
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );
}

export const useApproveProject = () => {
  return useMutation(approveProject);
}

export const useDisapproveProject = () => {
  return useMutation(disapproveProject);
}

export const useGetUnmarkedProjects = () =>{
  return useQuery(
    ["fetchUnmarkedProjects"],
    () => getUnmarkedProjects(),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useEditTeacher = () => {
  return useMutation(editTeacherProfile);
}

export const useGetAllProjects = (data) =>{
  return useQuery(
    ["fetchAllProjects", data.projectGroupId, data.status, data.mark, data.marked],
    () => getAllProjects(data),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useDeletePGroup = () => {
  return useMutation(deletePGroup);
}

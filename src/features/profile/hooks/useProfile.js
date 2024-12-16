import { useQuery, useMutation } from "react-query";
import { getStudentProfile, getProfessorsList, verifyRepoLink, createProject, getSharedUser, getTeacherProfile, createProjectsGroup, getGroupProjects, editCommonProfile, getCouratorGroups } from "../services/profileService";
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
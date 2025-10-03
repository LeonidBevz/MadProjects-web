
import { useQuery } from "react-query";
import { getProjectsCommits, getProjectsMarks, getProjectsStatuses, getUserCommits } from "../services/AnaliticsService";

export const useGetProjectsStatuses = (groupId) =>{
  return useQuery(['GetProjectsStatuses', groupId], () => getProjectsStatuses(groupId), {
    enabled: !!groupId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const useGetProjectsCommits = (groupId) =>{
  return useQuery(['GetProjectsCommits', groupId], () => getProjectsCommits(groupId), {
    enabled: !!groupId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const useGetProjectsMarks = (groupId) =>{
  return useQuery(['GetProjectsMarks', groupId], () => getProjectsMarks(groupId), {
    enabled: !!groupId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const useGetUserCommits = (projectId) =>{
  return useQuery(['GetUserCommits', projectId], () => getUserCommits(projectId), {
    enabled: !!projectId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
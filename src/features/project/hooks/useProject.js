import {  useMutation, useQuery } from 'react-query';
import { addRepo, deleteMember, deleteProject, deleteRepo, getInviteCode, getLastActivities, getProjectMeta, postUpdateProject } from '../services/ProjectService';

export const useGetProjectMeta = (projectId) => {
    return useQuery(['GetProject', projectId], () => getProjectMeta(projectId), {
      enabled: !!projectId,
      retry: false,
      refetchOnWindowFocus: false,
    });
};

export const usePostProjectData = () => {
  return useMutation( postUpdateProject);
};

export const useAddRepo = () =>{
  return useMutation( addRepo);
}

export const useGetInviteCode = (projectId) =>{
  return useQuery(['GetInviteCode', projectId], () => getInviteCode(projectId), {
    enabled: !!projectId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteRepo = () =>{
  return useMutation( deleteRepo);
}

export const useDeleteMemeber = () =>{
  return useMutation( deleteMember);
}

export const useDeleteProject = () =>{
  return useMutation( deleteProject);
}

export const useGetLastActivities = (projectId, count = null) =>{
  return useQuery(['GetLastActivities', projectId, count], () => getLastActivities(projectId, count), {
    enabled: !!projectId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

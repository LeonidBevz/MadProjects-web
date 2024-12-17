import {  useMutation, useQuery } from 'react-query';
import { addRepo, deleteMember, deleteRepo, getInviteCode, getProjectMeta, postUpdateProject } from '../services/ProjectService';

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
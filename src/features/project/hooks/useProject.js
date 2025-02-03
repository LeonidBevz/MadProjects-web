import {  useMutation, useQuery } from 'react-query';
import { addRepo, createSprint, deleteMember, deleteProject, deleteRepo, finishSprint, getInviteCode, getLastActivities, getProjectKards, getProjectMeta, getProjectSprints, getSprint, postUpdateProject, rateProject, updateSprint, retrySubmission, createChat  } from '../services/ProjectService';

export const useGetProjectMeta = (projectId) => {
    return useQuery(['GetProject', projectId], () => getProjectMeta(projectId), {
      enabled: !!projectId,
      retry: false,
      refetchOnWindowFocus: true,
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

export const useGetProjectSprints = (projectId) =>{
  return useQuery(['GetProjectSprints', projectId], () => getProjectSprints(projectId), {
    enabled: !!projectId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const useCreateSprint = () =>{
  return useMutation( createSprint);
}

export const useGetProjectKards = (projectId) =>{
  return useQuery(['GetProjectKards', projectId], () => getProjectKards(projectId), {
    enabled: !!projectId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const useGetSprint = (sprintId) =>{
  return useQuery(['GetSprint', sprintId], () => getSprint(sprintId), {
    enabled: !!sprintId,
    retry: false,
    refetchOnWindowFocus: true,
  });
}

export const useUpdateSprint = () =>{
  return useMutation( updateSprint);
}

export const useFinishSprint = () =>{
  return useMutation( finishSprint);
}

export const useRateProject = () =>{
  return useMutation( rateProject);
}

export const useRetrySubmission = () =>{
  return useMutation( retrySubmission );
}

export const useCreateChat = () =>{
  return useMutation( createChat )
}
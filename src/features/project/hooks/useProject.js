import {  useMutation, useQuery } from 'react-query';
import { getProjectMeta, postUpdateProject } from '../services/ProjectService';

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
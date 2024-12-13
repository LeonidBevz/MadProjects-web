import {  useQuery } from 'react-query';
import { getReposList, getRepoData } from '../services/GitActivityService'; 

export const useGetRepos = (userData) => {
    return useQuery(['reposList', userData], () => getReposList(userData), {
      enabled: !!userData.projectId,
      retry: false, 
      refetchOnWindowFocus: false,
    });
  };

export const useGetRepoData = (data) => {
    return useQuery(['repo', data], () =>getRepoData(data),{
      enabled: !!data.sha && !!data.repoName,
      retry: false, 
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 10, 
      staleTime: 1000 * 60 * 5,  
    });
};

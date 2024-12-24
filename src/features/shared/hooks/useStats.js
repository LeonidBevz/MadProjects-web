import { getCommitsGraphInnerPng, getExcelStats, getGradesGraphPng, getGroupCommitsPng } from "../services/statisticsService";
import { useQuery } from "react-query";
import { useAuth } from "features/shared/contexts/AuthContext";


export const useGetGradesGraphPng = (groupId) =>{
  const {accessToken} = useAuth()
  return useQuery(
    ["fetchGradesGraphPng", groupId],
    () => getGradesGraphPng(groupId, accessToken),
    {
      enabled: !!groupId && !!accessToken,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

export const useGetCommitsGraphInnerPng = (projectId) =>{
    const {accessToken} = useAuth()
    return useQuery(
      ["fetchCommitsGraphInner", projectId],
      () => getCommitsGraphInnerPng(projectId, accessToken),
      {
        enabled: !!projectId && !!accessToken,
        retry: false,
        refetchOnWindowFocus: false,
      }
    );
  }

  
export const useGetExcelStats = (projectGroupId, groupId) =>{
  const {accessToken} = useAuth()
  return useQuery(
    ["fetchGetExcel", groupId, projectGroupId],
    () => getExcelStats(projectGroupId, groupId, accessToken),
    {
      enabled: !!groupId && !!projectGroupId && !!accessToken,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

  
export const useGetGroupCommitsPng = (projectGroupId) =>{
  const {accessToken} = useAuth()
  return useQuery(
    ["fetchGroupCommits", projectGroupId],
    () => getGroupCommitsPng(projectGroupId, accessToken),
    {
      enabled: !!projectGroupId && !!accessToken,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}



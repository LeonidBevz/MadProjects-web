import { useQuery } from "react-query";
import { getUserGitData } from "../services/profileService";

export const useGetProfileGitData = (jwt, userId) => {
  return useQuery(
    ["fetchGitMeta", jwt, userId],
    () => getUserGitData({jwt: jwt, userId: userId}),
    {
      enabled: !!jwt && !!userId,
      retry: false,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 20, 
      staleTime: 1000 * 60 * 15,  
    }
  );
};

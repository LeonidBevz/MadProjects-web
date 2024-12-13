import { useQuery } from "react-query";
import { getStudentProfile } from "../services/profileService";

export const useGetStudentProfile = () => {
  return useQuery(
    ["fetchStudentProfile"],
    () => getStudentProfile(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 15, 
      staleTime: 1000 * 60 * 10,  
    }
  );
};

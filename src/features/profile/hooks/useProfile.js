import { useQuery, useMutation } from "react-query";
import { getStudentProfile, getProfessorsList, verifyRepoLink, createProject } from "../services/profileService";
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
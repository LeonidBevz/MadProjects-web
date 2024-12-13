import { useQuery } from "react-query";
import { BackURL } from "urls";
import axios from "axios";

const fetchAuthData = async (code, state) => {
  const data = await axios.get(`${BackURL}/github/githubCallbackUrl?code=${code}&state=${state}`);
  return data;
};

const useGitAuth = (code, state) => {
  return useQuery(
    ["fetchGitAuth", code, state],
    () => fetchAuthData(code, state),
    {
      enabled: !!code && !!state,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGitAuth;
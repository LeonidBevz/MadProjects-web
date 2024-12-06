import { useQuery } from "react-query";
import axios from "axios";
import { GitBackUrl } from "urls";

const fetchAuthData = async (code, state) => {
  const data = await axios.get(`${GitBackUrl}/githubCallbackUrl?code=${code}&state=${state}`);
  return data;
};

const useGitAuth = (code, state) => {
  return useQuery(
    ["fetchGitAuth", code, state],
    () => fetchAuthData(code, state),
    {
      enabled: !!code && !!state,
      retry: false,
    }
  );
};

export default useGitAuth;
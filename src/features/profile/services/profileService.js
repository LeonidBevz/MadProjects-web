import axios from "axios";
import { GitBackUrl } from "urls";

export const getUserGitData = async (userData) => {
  const response = await axios.get(GitBackUrl + '/getUserMeta?jwt=' + userData.jwt + "&userId=" + userData.userId);
  return response.data;
};




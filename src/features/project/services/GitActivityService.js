import axios from "axios";
import { GitBackUrl } from "urls";

export const getReposList = async (userData) => {
  const response = await axios.get(GitBackUrl + '/getProjectRepoBranches?jwt=' + userData.jwt + "&projectId="+ userData.projectId);
  return JSON.parse(response.data);
};

export const getRepoData = async (data) => {
  const response = await axios.get(GitBackUrl + '/getRepoBranchContent?jwt=' + data.jwt + "&sha=" + data.sha + "&repoName=" + data.repoName);
  return response.data;
};


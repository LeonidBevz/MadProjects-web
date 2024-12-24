import axios from "axios";
import { AnaliticsURL } from "urls";

export const getGradesGraphPng = async (groupId, token ) =>{
    const response = await axios.get( AnaliticsURL + "/graph_grades?type=png&groupId=" + groupId +"&token=" + token)
    return response.data;
} 

export const getCommitsGraphInnerPng = async (projectId, token ) =>{
    const response = await axios.get( AnaliticsURL + "/graph_user_commits?type=png&projectId=" + projectId +"&token=" + token)
    return response.data;
}

export const getExcelStats = async (projectGroupId, groupId, token ) =>{
    const response = await axios.get(
        `${AnaliticsURL}/excel_grades?groupId=${groupId}&projectGroupId=${projectGroupId}&token=${token}`,
        {
          responseType: 'arraybuffer',
        }
      );
      return response.data;
}

export const getGroupCommitsPng = async (projectGroupId, token ) =>{
    const response = await axios.get( AnaliticsURL + "/graph_commits?type=png&groupId=" + projectGroupId +"&token=" + token)
    return response.data;
}
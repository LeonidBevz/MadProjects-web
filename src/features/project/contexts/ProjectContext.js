import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetProjectMeta } from '../hooks/useProject';
import { useParams } from 'react-router-dom';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const {projectId} = useParams()
  const {data, isLoading: isMetaLoading, error: projectMetaError, refetch} = useGetProjectMeta(projectId)  
  const [projectData, setProjectData] = useState()
  const [members, setMembers] = useState()
  const [repos, setRepos] = useState()
  const [isCreator, setIsCreator] = useState(false)
  const [projectStatus, setProjectStatus] = useState("")
  const [projectMark, setProjectMark] = useState()

  useEffect(()=>{
    if (!data) return
    setProjectData(data.meta)
    setMembers(data.members)
    setRepos(data.repos)
    setIsCreator(data.isCreator)
    setProjectStatus(data.status)
    setProjectMark(data.mark)
    // eslint-disable-next-line
  },[data])

  const value = {
    projectData,
    projectStatus,
    projectMark,
    members,
    repos,
    isCreator,
    isMetaLoading, projectMetaError, refetch,
  }
  
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  return useContext(ProjectContext);
};
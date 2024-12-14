import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetProjectMeta } from '../hooks/useProject';
import { useParams } from 'react-router-dom';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const {projectId} = useParams()
  const {data, isLoading: isMetaLoading, error: projectMetaError, isSuccess, refetch} = useGetProjectMeta(projectId)  
  const [projectData, setProjectData] = useState()
  const [members, setMembers] = useState()
  const [repos, setRepos] = useState()
  const [isCreator, setIsCreator] = useState(false)

  useEffect(()=>{
    if (!isSuccess) return
    setProjectData(data.meta)
    setMembers(data.members)
    setRepos(data.repos)
    setIsCreator(data.isCreator)
    // eslint-disable-next-line
  },[isSuccess])

  const value = {
    projectData,
    members,
    repos,
    isCreator,
    isMetaLoading, projectMetaError, refetch
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
import React, {useEffect, useState} from "react";
import SearchDropDown from "features/shared/components/SearchDropDown";

import { useAuth } from "features/shared/contexts/AuthContext";

import NotFoundPage from "features/shared/notfound";
import { useGetCuratorGroupsJwt, useGetStudyGroups } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";
import ObjectSearchDropDown from "features/shared/components/ObjectSearchDropDown";
import { useGetExcelStats } from "../../shared/hooks/useStats";
import { AnaliticsURL } from "urls";
import { useNotifications } from "features/shared/contexts/NotificationsContext";

const ProjectsStatsPage = ()=>{
    const {role, accessToken} = useAuth()
    const [chosenProjectsGroup, setChosenProjectsGroup] = useState()
    const [chosenStudyGroup, setChosenStudyGroup] = useState()
    const [chosenProjectsGroupComp, setChosenProjectsGroupComp] = useState()
    const {addNotification} = useNotifications()
    const {data: projectsGroups, isLoading, error} = useGetCuratorGroupsJwt()

    const {data: studyGroups, error: studyGroupsError} = useGetStudyGroups(chosenProjectsGroup?.id)

    const {data: ExcelData, error: excelError} = useGetExcelStats(chosenProjectsGroup?.id, chosenStudyGroup)

    useEffect(()=>{
      if (!studyGroupsError) return

      addNotification("Ошибка получения учебных групп " + studyGroupsError.status, "error")
     // eslint-disable-next-line
    },[studyGroupsError])

    useEffect(()=>{
      if (!excelError) return
    
      addNotification("Ошибка получения отчета " + excelError.status, "error")
    // eslint-disable-next-line
    },[excelError])

    const handleDownload = async () => {
      const blob = new Blob([ExcelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `Report${chosenStudyGroup}.xlsx`;
 
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
    
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    };

    
    useEffect(()=>{
      if (!ExcelData) return   
      handleDownload()
    },[ExcelData])

    if (role !== "Curator") {
        return (<NotFoundPage/>)        
    }   
    
   
    if (isLoading){
      return (<div className="loading-page page">
        <Loading/>
      </div>)
    }

    if (error) {
      return (<div>
        {"Что-то пошло не так " + error.status}
      </div>)
    }

    return(
        <div className="info-page page">
            <div className="info-container">
            <h2>{`Экспорт оценок в Excel`}</h2>
                <div className="info-tile info-tile-center" >
                      <div className="table-rate-flex" style={{flexWrap: "wrap", gap: '1rem', marginBottom: "0.8rem"}}>
                        <div className="flex1">
                          <ObjectSearchDropDown values={projectsGroups} displayKey={"title"} chosenOption={chosenProjectsGroup} setChosenOption={setChosenProjectsGroup} emptyMessage={"Группа проектов *"}/> 
                        </div>
                        <div style={{width: "200px"}}>
                          {studyGroups && (
                            <SearchDropDown values={studyGroups?.groups || []} chosenOption={chosenStudyGroup} setChosenOption={setChosenStudyGroup} emptyMessage={"Учебная группа"}/> 
                          )}
                         
                        </div>
                      </div>    
                      {ExcelData && (
                        <span style={{marginTop: "10px"}}>{"Ваш отчет готов: "}
                          <span onClick={handleDownload} style={{textDecoration: "underline", fontStyle: "italic", cursor: "pointer"}}>Скачать</span>
                        </span>
                      )}                
                </div>
            </div>
            <div className="info-container" style={{marginBottom: '200px'}}>
                <h2>Сравнительный анализ проектов</h2>
                 <div className="info-tile info-tile-center" >
                    <div className="table-rate-flex">
                            <div className="flex1">
                              <ObjectSearchDropDown values={projectsGroups} displayKey={"title"} chosenOption={chosenProjectsGroupComp} setChosenOption={setChosenProjectsGroupComp} emptyMessage={"Группа проектов *"}/> 
                            </div>
                    </div>
                    {chosenProjectsGroupComp && (
                      <iframe
                        src={`${AnaliticsURL}/graph_statuses?type=html&groupId=${chosenProjectsGroupComp.id}&token=${accessToken}`}
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "Статусы прооектов"
                      />
                    )}
                    {chosenProjectsGroupComp && (
                      <iframe
                        src={`${AnaliticsURL}/graph_commits?type=html&groupId=${chosenProjectsGroupComp.id}&token=${accessToken}`}
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "Коммиты"
                      />
                    )}
                    {chosenProjectsGroupComp && (
                      <iframe
                        src={`${AnaliticsURL}/graph_grades?type=html&groupId=${chosenProjectsGroupComp.id}&token=${accessToken}`}
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "Оценки"
                      />
                    )}
                </div>
            </div>
            
        </div>
    )
}

export default ProjectsStatsPage
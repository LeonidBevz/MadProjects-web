import React, {useEffect, useState} from "react";
import SearchDropDown from "features/shared/components/SearchDropDown";
import ConfirmIco from "images/conf";
import { AnaliticsURL } from "urls";
import { useAuth } from "features/shared/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useProjectContext } from "./contexts/ProjectContext";
import { useRateProject } from "./hooks/useProject";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import Loading from "features/shared/components/Loading";
import NotFoundPage from "features/shared/notfound";

const AnaliticsPage = ()=>{
    const {projectId} = useParams()
    const {accessToken, role} = useAuth()
    const {projectMark} = useProjectContext()
    const [rate, setRate] = useState(5)

    useEffect(()=>{
        setRate(projectMark || 5)
    },[projectMark])
    
    const {addNotification} = useNotifications()

    const {mutate, isLoading} = useRateProject()

    const handleRate = () =>{
        mutate({projectId: projectId, mark: rate},{
            onSuccess: ()=>{
                addNotification(`Успешно оценено на ${rate}`, "success")
            },
            onError: (error)=>{
                addNotification(`Ошибка оценивания ${error.status}`, "error")
            }
            
        })
    }   

    if (role!== "Curator") {
        return (<NotFoundPage/>)        
    }
   
    
    return(
        <div className="info-page">
            <div className="indo-container">
            <h2>{`Оценка ${projectMark ? "(Уже оценено)": ""}`}</h2>
                <div className="info-tile info-tile-center" >
                    {isLoading && (<Loading/>)}
                    {!isLoading && (
                      <div className="table-rate-flex">
                        <div className="flex1">
                          <SearchDropDown values={[5,4,3,2]} chosenOption={rate} setChosenOption={setRate} emptyMessage={"Оценка"}/> 
                        </div>
                        <button className="conf-butt" onClick={()=>{}}>
                        <ConfirmIco onClick={handleRate}/>    
                        </button>
                      </div>
                    )}
                    
                </div>
            </div>
            <div className="indo-container">
                <h2>Аналитика</h2>
                <div className="info-tile">
                    <iframe
                        src={`${AnaliticsURL}/graph_statuses?type=html&projectId=${projectId}&token=${accessToken}`}
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "frame1"
                    />
                    <iframe
                        src={`${AnaliticsURL}/graph_user_commits?type=html&projectId=${projectId}&token=${accessToken}`}
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "frame2"
                    />
                </div>
            </div>
            
        </div>
    )
}

export default AnaliticsPage
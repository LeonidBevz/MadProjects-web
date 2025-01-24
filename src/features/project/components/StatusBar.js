import CrossIco from "images/cross"
import React, {useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProjectContext } from "../contexts/ProjectContext"
import { useTheme } from "features/shared/contexts/ThemeContext"
import { useNotifications } from "features/shared/contexts/NotificationsContext" 
import { useRetrySubmission } from "../hooks/useProject"

const StatusBar = () =>{
    const {projectId} = useParams()
    const { projectStatus } = useProjectContext()
    const [isBarVisible, setIsBarVisible] = useState(true)
    const {isNightTheme} = useTheme()
    const { addNotification } = useNotifications()
    const navigate = useNavigate()
    const projectStatuses = {
      Pending: "Pending",
      Accepted: "Accepted",
      Denied: "Unapproved"
    }

    const {mutate, isSuccess} = useRetrySubmission()

    useEffect(()=>{
        if(!isSuccess) return
        addNotification("Успешно отправлено на перепроверку!","success")
        setIsBarVisible(false)
    },[isSuccess])

    const handleReApprove = () => {
        mutate({projectId: projectId})
    }

    if (isBarVisible && projectStatuses.Pending === projectStatus){
        return (
            <div className="status-bar yellow">
                <span style={{fontWeight: "700"}}>Проект ожидает одобрения</span>
                <CrossIco className="settings-cross" onClick={()=>setIsBarVisible(false)} color={isNightTheme ? "#d4d3cf" : "black"}/>
            </div>
        )
    }
    if (isBarVisible && projectStatuses.Denied === projectStatus){
        return (
            <div className="status-bar red">
                <div>
                    <span style={{marginRight: "10px", color: "var(--alt-text-color)", fontWeight: "700"}}>
                        Проект отклонен!
                    </span>
                    <span onClick={()=>{navigate(`/${projectId}/messenger/`)}} style={{color: "var(--alt-text-color)", textDecoration: "underline", fontWeight: "300", fontStyle: "italic", cursor: "pointer", marginRight: "10px"}}>
                        Подробнее
                    </span>
                    <span onClick={handleReApprove} style={{color: "var(--alt-text-color)", textDecoration: "underline", fontWeight: "300", fontStyle: "italic", cursor: "pointer" }}>
                        Отправить повторно
                    </span>
                </div>
                <CrossIco className="settings-cross" onClick={()=>setIsBarVisible(false)} color={"white"}/>
            </div>
        )
    }   
    
}

export default StatusBar
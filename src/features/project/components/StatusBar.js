import CrossIco from "images/cross"
import React, {useState} from "react"

const StatusBar = () =>{
    const [projectStatus, setProjectStatus] = useState("Denied")
    const projectStatuses = {
      Pending: "Pending",
      Accepted: "Accepted",
      Denied: "Denied"
    }

    if (projectStatuses.Pending === projectStatus){
        return (
            <div className="status-bar yellow">
                <span style={{fontWeight: "700"}}>Проект ожидает одобрения</span>
                <CrossIco className="settings-cross" onClick={()=>setProjectStatus("")} color={"black"}/>
            </div>
        )
    }
    if (projectStatuses.Denied === projectStatus){
        return (
            <div className="status-bar red">
                <div>
                    <span style={{marginRight: "10px", color: "var(--alt-text-color)", fontWeight: "700"}}>
                        Проект отклонен!
                    </span>
                    <span style={{color: "var(--alt-text-color)", textDecoration: "underline", fontWeight: "300", fontStyle: "italic", cursor: "pointer" }}>Подробнее</span>
                </div>
                <CrossIco className="settings-cross" onClick={()=>setProjectStatus("")} color={"white"}/>
            </div>
        )
    }   
    
}

export default StatusBar
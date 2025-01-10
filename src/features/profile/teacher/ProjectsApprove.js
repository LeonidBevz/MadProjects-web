import React, {useState, useEffect} from "react";
import Table from "features/profile/components/Table";
import EmptyTable from "features/profile/components/EmptyTable";
import ProfessorMessage from "../components/ProfessorMessage";
import { useNotifications } from "features/shared/contexts/NotificationsContext";
import { useApproveProject, useDisapproveProject, useGetPendingProjects } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";

const ProjectsApprovePage = () => {
    const [isMessageWindowVisible, setIsMessageWindowVisible] = useState(false)
    const { addNotification } = useNotifications();
    const [denyProject, setDenyProject] = useState()
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Группа проектов", key: "group",type: "text"},
        {name: "Число участников", key: "teamcount",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"},
        {name: "Вердикт", type: "approve"}
    ]

    const [table,setTable] = useState([])

    const {data, isLoading, error } = useGetPendingProjects()
    useEffect(()=>{
        if (!data) return
      
        const newTable = data.map(project=>({
            id: project.id,
            name: project.title,
            formateddate: project.createDate,
            linkto: `/${project.id}/info`,
            teamcount: project.maxMembersCount,
            group: project.groupTitle
        }))
        setTable(newTable)
    },[data])

    const {mutate: mutateApprove} = useApproveProject()
    const {mutate: mutateDisapprove} = useDisapproveProject()
   
    const onApprove = (project)=>{
        mutateApprove(project.id,{
            onSuccess: ()=>{
                addNotification('Проект одобрен', 'success');
                removeProject(project.id)
            },
            onError: (error)=>{
                addNotification('Ошибка одобрения '+ error.status, 'error');
            }
        })
    }
    const onDeny = (project) => {
        setIsMessageWindowVisible(true)
        setDenyProject(project)
    }

    const sendDeny = (message) =>{
        mutateDisapprove({
            projectId: denyProject.id,
            message: message
        }, {
            onSuccess: ()=>{
                addNotification('Проект успешно отклонен', 'info');
                setIsMessageWindowVisible(false)
                removeProject(denyProject.id)
                setDenyProject()
            },
            onError: ()=>{
                addNotification('Ошибка отклонения '+ error.status, 'error');
                setIsMessageWindowVisible(false)
                setDenyProject()
            }
        })
        
    }

    const removeProject = (projectId)=>{
        const filteredPojects = table.filter(project => project.id !== projectId)
        setTable(filteredPojects)
    }
    if (isLoading) {
        return(
            <div className="loading-page page">
                <Loading/>
            </div>
        )
    }

    if (error){
        return(
            <div>
                {`Ошибка загрузки ${error.status}`}
            </div>
        )
    }
    return (
      <div className="info-page page">  
        <div className={isMessageWindowVisible ? "bg-blur-shown" :"bg-blur-hidden"}/>
        {isMessageWindowVisible && (<ProfessorMessage project= {denyProject} onConfirm={sendDeny} onCancel={()=>setIsMessageWindowVisible(false)}/>)}         

        <div className="info-container">
            <h2>Одобрение тем проектов</h2>     
            <div className="table-tile">
            {table.length === 0 
                ? <EmptyTable text={"Тут пусто, чтобы здесь появились проекты, создайте группу проектов в профиле, и ожидайте заявок от студентов."}/> 
                : <Table titles={titles} data={table} onApprove={onApprove} onDeny={onDeny}/>}       
            </div>
        </div>
      </div>
    );
  }
  
  export default ProjectsApprovePage;
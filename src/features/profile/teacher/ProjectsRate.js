import React, {useEffect, useState} from "react";
import Table from "features/profile/components/Table";
import EmptyTable from "features/profile/components/EmptyTable";
import { useGetUnmarkedProjects } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";

const ProjectsRatePage = () => {
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Группа проектов", key: "group",type: "text"},
        {name: "Команда", key: "formatedteam",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"}
    ]
    const [table, setTable] = useState([])

    const {data, isLoading, error } = useGetUnmarkedProjects()
    useEffect(()=>{
        if (!data) return
      
        const newTable = data.map(project=>({
            name: project.title,
            formateddate: project.createDate,
            linkto: `/${project.id}/analitics`,
            formatedteam: project.members.map(member => (member.lastName + " "+ member.firstName + " " + member.secondName +" (" + member.group + ")")).join('\n'),
            group: project.groupTitle
        }))
        setTable(newTable)
    },[data])

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
        <div className="info-container">
            <h2>Оценивание проектов</h2>       
            {table.length === 0 ? <EmptyTable text={"Тут пусто, чтобы здесь появились проекты, одобрите их "} linktext={"тут"} linkto={"/teacher/approve"}/> : <Table titles={titles} data={table}/>}  
            
        </div>
      </div>
    );
  }
  
  export default ProjectsRatePage;
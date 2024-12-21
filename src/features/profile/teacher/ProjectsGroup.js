import React, { useEffect, useState } from "react";
import Table from "features/profile/components/Table";
import { useParams } from "react-router-dom";
import EmptyTable from "features/profile/components/EmptyTable";
import { useGetGroupProjects } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";

const ProjectsGroupPage = () => {
    const { group } = useParams();
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Команда", key: "formatedteam",type: "text"}, 
        {name: "Дата создания", key: "formateddate", type: "text"},
        {name: "Статус", key: "status", type: "text"}
    ]

    const {data, isLoading, error } = useGetGroupProjects(parseInt(group))
    
    const [table,setTable] = useState([])

    useEffect(()=>{
        if (!data) return
        const statusMapping = {
            Pending: "Ожидает одобрения",
            Approved: "Одобрен",
            Unapproved: "Отклонен",
          };
        const newTable = data.projects.map(project=>({
            name: project.title,
            formatedteam: project.members.map(member => (member.lastName + " "+ member.firstName + " " + member.secondName +" (" + member.group + ")")).join('\n'),
            formateddate: project.createDate,
            linkto: `/${project.id}/activity`,
            status: statusMapping[project.status]
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
            <h2>{data.title}</h2>
            {table.length === 0 ? <EmptyTable text={"Тут пусто, чтобы здесь появились проекты, одобрите их "} linktext={"тут"} linkto={"/teacher/approve"}/> : <Table titles={titles} data={table}/>}       
            
        </div>
      </div>
    );
  }
  
  export default ProjectsGroupPage;
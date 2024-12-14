import React from "react";
import Table from "features/profile/components/Table";
import EmptyTable from "features/profile/components/EmptyTable";

const ProjectsRatePage = () => {
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Группа проектов", key: "group",type: "text"},
        {name: "Число участников", key: "teamcount",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"}
    ]

    const table = [
        {
            name: "Audionautica", 
            group: "Технологии программирования", 
            teamcount: 4,
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/1/analitics', 
            formateddate: "29.03.2024"
        },{
            name: "MadProjects", 
            group: "Технологии программирования", 
            teamcount: 2,
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/2/analitics', 
            formateddate: "29.03.2024"
        }
    ]
    const onRate = ()=>{
        
    }

    return (
      <div className="info-page page">  
        <div className="info-container">
            <h2>Оценивание проектов</h2>       
            {table.length === 0 ? <EmptyTable text={"Тут пусто, чтобы здесь появились проекты, одобрите их "} linktext={"тут"} linkto={"/teacher/approve"}/> : <Table titles={titles} data={table} onRate={onRate}/>}  
            
        </div>
      </div>
    );
  }
  
  export default ProjectsRatePage;
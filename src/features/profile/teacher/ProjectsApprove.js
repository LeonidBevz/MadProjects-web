import React from "react";
import Table from "features/profile/components/Table";
import EmptyTable from "features/profile/components/EmptyTable";

const ProjectsApprovePage = () => {
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Группа проектов", key: "group",type: "text"},
        {name: "Число участников", key: "teamcount",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"},
        {name: "Вердикт", type: "approve"}
    ]

    const table = [
        {
            name: "Audionautica", 
            group: "Технологии программирования", 
            teamcount: 4,
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/1/info', 
            formateddate: "29.03.2024"
        },{
            name: "MadProjects", 
            group: "Технологии программирования", 
            teamcount: 2,
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/2/info', 
            formateddate: "29.03.2024"
        }
    ]
    const onApprove = ()=>{

    }
    const onDeny = ()=>{
        
    }

    return (
      <div className="info-page page">  
        <div className="info-container">
            <h2>Одобрение тем проектов</h2>       
            {table.length === 0 ? <EmptyTable text={"Тут пусто, чтобы здесь появились проекты, создайте группу проектов в профиле, и ожидайте заявок от студентов."}/> : <Table titles={titles} data={table} onApprove={onApprove} onDeny={onDeny}/>}       
            
        </div>
      </div>
    );
  }
  
  export default ProjectsApprovePage;
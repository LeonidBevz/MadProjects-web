import React from "react";
import Table from "../../../components/table";

const ProjectsRatePage = () => {
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Группа проектов", key: "group",type: "text"},
        {name: "Число участников", key: "teamcount",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"},
        {name: "Вердикт", type: "rate"}
    ]

    const table = [
        {
            name: "Audionautica", 
            group: "Технологии программирования", 
            teamcount: 4,
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/audionautica/activity', 
            formateddate: "29.03.2024"
        },{
            name: "MadProjects", 
            group: "Технологии программирования", 
            teamcount: 2,
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/madprojects/activity', 
            formateddate: "29.03.2024"
        }
    ]
    const onRate = ()=>{
        
    }

    return (
      <div className="info-page">  
        <div className="info-container">
            <h2>Оценивание проектов</h2>       
            <Table titles={titles} data={table} onRate={onRate}/>
        </div>
      </div>
    );
  }
  
  export default ProjectsRatePage;
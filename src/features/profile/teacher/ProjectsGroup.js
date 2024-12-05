import React from "react";
import Table from "features/profile/components/Table";
import { useParams } from "react-router-dom";
import EmptyTable from "features/profile/components/EmptyTable";

const ProjectsGroupPage = () => {
    const { group } = useParams();
    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Команда", key: "formatedteam",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"}
    ]

    const table = [
        {
            name: "Audionautica", 
            team: [{fullname: "Бевз Леонид Александрович", group: "4219"}, {fullname: "Выборов Андрей Эдуардович", group: "4215"}], 
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/1/activity', 
            formatedteam: "Бевз Леонид Александрович (гр. 4215)\nВыборов Андрей Эдуардович (гр.4219)",
            formateddate: "29.03.2024"
        },{
            name: "MadProjects", 
            team: [{fullname: "Бевз Леонид Александрович", group: "4219"}, {fullname: "Выборов Андрей Эдуардович", group: "4215"}], 
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/2/activity', 
            formatedteam: "Бевз Леонид Александрович (гр. 4215)\nВыборов Андрей Эдуардович (гр.4219)",
            formateddate: "29.03.2024"
        }
    ]

    return (
      <div className="info-page page">  
        <div className="info-container">
            <h2>{group}</h2>
            {table.length === 0 ? <EmptyTable text={"Тут пусто, чтобы здесь появились проекты, одобрите их "} linktext={"тут"} linkto={"/teacher/approve"}/> : <Table titles={titles} data={table}/>}       
            
        </div>
      </div>
    );
  }
  
  export default ProjectsGroupPage;
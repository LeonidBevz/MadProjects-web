import React from "react";
import Table from "../../../components/table";
import { useParams } from "react-router-dom";

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
            linkto: '/audionautica/activity', 
            formatedteam: "Бевз Леонид Александрович (гр. 4215)\nВыборов Андрей Эдуардович (гр.4219)",
            formateddate: "29.03.2024"
        },{
            name: "MadProjects", 
            team: [{fullname: "Бевз Леонид Александрович", group: "4219"}, {fullname: "Выборов Андрей Эдуардович", group: "4215"}], 
            createdate: "2024-03-29T10:00:00Z",
            linkto: '/madprojects/activity', 
            formatedteam: "Бевз Леонид Александрович (гр. 4215)\nВыборов Андрей Эдуардович (гр.4219)",
            formateddate: "29.03.2024"
        }
    ]

    return (
      <div className="info-page">  
        <div className="info-container">
            <h2>{group}</h2>       
            <Table titles={titles} data={table}/>
        </div>
      </div>
    );
  }
  
  export default ProjectsGroupPage;
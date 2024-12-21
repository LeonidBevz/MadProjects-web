import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import "css/infopage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useProjectContext } from "./contexts/ProjectContext";

const InfoPage = () => {
    const navigate = useNavigate()
    const {isNightTheme} = useTheme()
    const { projectData, members, repos } = useProjectContext()
    const [data, setData] = useState({ 
      title: "",
      description: "",
      team: [],
      repos: []
    })

    useEffect(()=>{
      if(!projectData) return

      setData({
        title: projectData.title,
        description: projectData.desc,
        team: members,
        repos: repos,
    })
    },[projectData])

    const goToRepo = (repo) => {
      window.open(repo, "_blank");
    };
  
    return (
      <div className="info-page page">          
         <div className="info-container">
            <h1>{data.title} </h1>
            <div className="info-tile">
                <p>{data.description}</p>
            </div>
          </div>
          {data.team.length !== 0 && (<div className="info-container">
              <h2>Команда</h2>
              <div className="info-tile">
                {data.team.map((member, index)=>(
                  <div className="sprint" key={index}>
                    <div className="sprints-flex" onClick={()=>navigate(`/profile/${member.name}`)}>
                      <p>{member.lastName + " " + member.firstName+ " " + member.secondName  }</p>
                      <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="grad-separator"></div>
                  </div>
                ))}
            </div>
          </div>)}
          {data.repos.length !== 0 && (<div className="info-container">
              <h2>Репозитории</h2>
              <div className="info-tile">
                {data.repos.map((repo, index)=>(
                  <div className="sprint" key={index}>
                    <div className="sprints-flex" onClick={()=>{goToRepo(repo.link)}}>
                      <p>{repo.link}</p>
                      <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="grad-separator"></div>
                  </div>
                ))}
            </div>
          </div>)}
      </div>
    );
  }
  
  export default InfoPage;
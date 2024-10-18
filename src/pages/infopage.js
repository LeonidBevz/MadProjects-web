import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./infopage.css"
import useToken from "../hooks/useToken";
import RightArrowIco from "../images/arrowrightico";

const InfoPage = () => {
    const {project} = useParams()
    const navigate = useNavigate()
    const {isNightTheme} = useToken()
    const [data, setData] = useState({
        description: "Audionautica - это платформа для стриминга и прослушивания музыки. Оно позволяет пользователям создавать плейлисты, искать треки по жанрам, исполнителям или альбомам, и сохранять любимые песни для оффлайн-прослушивания. Встроенные алгоритмы подбирают персональные рекомендации на основе музыкальных предпочтений, а также доступен режим караоке и создание совместных плейлистов с друзьями. Простое управление, качественное аудио и возможность делиться любимой музыкой делают это приложение идеальным для меломанов.",
        team: [{name: "Leonid"},{name: "Kalesty"}],
        repos: [{name: "audionautica-web"},{name: "audionautica-android"},{name: "audionautica-neuro"}],
        readmeurl: "a",
    })
  
    return (
      <div className="info-page">          
         <div className="info-container">
            <h1 className="cl-trans">{`${project}`} </h1>
            <div className="info-tile bg-trans">
                <p>{data.description}</p>
            </div>
          </div>
          {data.team.length !== 0 && (<div className="info-container">
              <h2 className="cl-trans">Команда</h2>
              <div className="info-tile bg-trans">
                {data.team.map((member, index)=>(
                  <div className="sprint" key={index}>
                    <div className="sprints-flex" onClick={()=>navigate(`/profile/${member.name}`)}>
                      <p>{member.name}</p>
                      <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="grad-separator"></div>
                  </div>
                ))}
            </div>
          </div>)}
          {data.repos.length !== 0 && (<div className="info-container">
              <h2 className="cl-trans">Репозитории</h2>
              <div className="info-tile bg-trans">
                {data.repos.map((repo, index)=>(
                  <div className="sprint" key={index}>
                    <div className="sprints-flex" onClick={()=>navigate(`repolink`)}>
                      <p>{repo.name}</p>
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
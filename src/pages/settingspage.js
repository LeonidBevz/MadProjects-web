import React, {useState} from "react";
import RightArrowIco from "../images/arrowrightico";
import CrossIco from "../images/cross";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./settingspage.css"
import DownArrowIco from "../images/arrowdown";
import UpArrowIco from "../images/arrowupico";

const SettingsPage = () => {
    const {project} = useParams()
    const navigate = useNavigate()
    const {isNightTheme} = useToken()
    const [data, setData] = useState({
        description: "Audionautica - это платформа для стриминга и прослушивания музыки. Оно позволяет пользователям создавать плейлисты, искать треки по жанрам, исполнителям или альбомам, и сохранять любимые песни для оффлайн-прослушивания. Встроенные алгоритмы подбирают персональные рекомендации на основе музыкальных предпочтений, а также доступен режим караоке и создание совместных плейлистов с друзьями. Простое управление, качественное аудио и возможность делиться любимой музыкой делают это приложение идеальным для меломанов.",
        team: [{name: "Leonid"},{name: "Kalesty"}],
        repos: [{name: "audionautica-web"},{name: "audionautica-android"},{name: "audionautica-neuro"}],
        readmeurl: "a",
    })
    const moveUp = (index) =>{
      if (index > 0) {
        const newRepos = [...data.repos];
        [newRepos[index], newRepos[index - 1]] = [newRepos[index - 1], newRepos[index]];
        setData((prevData) => ({
            ...prevData,
            repos: newRepos,
        }));
    }
    }

    const moveDown = (index) =>{
      if (index < data.repos.length - 1) {
        const newRepos = [...data.repos];
        [newRepos[index], newRepos[index + 1]] = [newRepos[index + 1], newRepos[index]];
        setData((prevData) => ({
            ...prevData,
            repos: newRepos,
        }));
     }
    }
    const deleteRepo = (index) =>{
      const newRepos = data.repos.filter((_, i) => i !== index);
      setData((prevData) => ({
          ...prevData,
          repos: newRepos,
      }));
    }
    const deleteMember = (index) =>{
      const newMembers = data.team.filter((_, i) => i !== index);
      setData((prevData) => ({
          ...prevData,
          team: newMembers,
      }));
    }
    return (
        <div className="info-page">          
         {data.team.length !== 0 && (<div className="info-container">
             <h2>Команда</h2>
             <div className="info-tile">
               {data.team.map((member, index)=>(
                 <div className="sprint" key={index}>
                   <div className="settings-flex">
                     <p onClick={()=>navigate(`/profile/${member.name}`)}>{member.name}</p>
                     <CrossIco className="settings-cross" onClick={()=>deleteMember(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                   </div>
                   <div className="grad-separator"></div>
                 </div>
               ))}
               <div className="sprint">
                   <div className="settings-flex">
                     <p>Добавить...</p>
                     <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                   </div>
                   <div className="grad-separator"></div>
                </div>
           </div>
         </div>)}
         {data.repos.length !== 0 && (<div className="info-container">
             <h2>Репозитории</h2>
             <div className="info-tile">
               {data.repos.map((repo, index)=>(
                 <div className="sprint" key={index}>
                   <div className="settings-flex">
                     <p onClick={()=>navigate(`repolink`)}>{repo.name}</p>
                     <div className="icons-container">
                      <UpArrowIco className="settings-arrow" onClick={()=>moveUp(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                      <DownArrowIco className="settings-arrow" onClick={()=>moveDown(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                      <CrossIco className="settings-cross" onClick={()=>deleteRepo(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                     </div>
                   </div>
                   <div className="grad-separator"></div>
                 </div>
               ))}
                <div className="sprint">
                   <div className="settings-flex">
                     <p>Добавить...</p>
                     <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                   </div>
                   <div className="grad-separator"></div>
                </div>
           </div>
         </div>)}
         <div className="info-container">
             <h2>Общее</h2>
             <div className="buttons-tile">
               <button className="edit-butt">Изменить название/описание</button>
               <button className="delete-butt">Удалить проект</button>
            </div>
         </div>
     </div>      
    );
  }
  
  export default SettingsPage;
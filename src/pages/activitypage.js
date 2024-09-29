import React, { useState } from "react";
import Activity from "../components/activity";
import "./activitypage.css"
import SearchDropDown from "../components/searchdropdown";
import Commit from "../components/commit";
import LastActivity from "../components/lastactivity";
import { useNavigate } from "react-router-dom";
import RightArrowIco from "../images/arrowrightico";
import useToken from "../hooks/useToken";

function formatDate(date) {
  const dateParts = date.slice(0, 10).split('-'); 
  const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
  return formattedDate;
}

const ActivityPage = () => {
    const [year,setYear] = useState(2024)
    const [chosenMember,setChosenMember] = useState("Kaelesty") 
    const [chosenRepo,setChosenRepo] = useState("Audionautica-web") 
    const navigate = useNavigate()
    const {isNightTheme} = useToken()
    const lastActivityData = [{date: "2024-08-29T10:00:00Z", link: "audoinautica-neuro", text: "Andrey Butyrev привязал новый репозиторий ", linkTo: "/profile"},{date: "2024-03-29T10:00:00Z", link: "audoinautica-neuro", text: "Andrey Butyrev привязал новый репозиторий ", linkTo: "/profile"}]
    const sprints = [{name: "Последние правки (текущий)", linkTo: "/bomba/"},{name: "Плейлисты & Поиск (25.08.24)",linkTo: "/bomba/"},{name:"Пилим MVP (28.04.24)",linkTo: "/bomba/"}]
    const commitData = [
      [
        {
          name: "Initial commit",
          date: "2024-08-29T10:00:00Z", 
          username: "johndoe",
          link: "https://github.com/johndoe/repo/commit/1",
          profilepic: "https://avatars.githubusercontent.com/u/123456?v=4"
        },
        {
          name: "Fix bug in login",
          date: "2024-08-29T11:13:00Z",
          username: "janedoe",
          link: "https://github.com/janedoe/repo/commit/2",
          profilepic: "https://avatars.githubusercontent.com/u/789012?v=4"
        }
      ],
      [
        {
          name: "Update README",
          date: "2024-09-28T12:30:00Z", 
          username: "johndoe",
          link: "https://github.com/johndoe/repo/commit/3",
          profilepic: "https://avatars.githubusercontent.com/u/123456?v=4"
        },
        {
          name: "Update README",
          date: "2024-09-28T12:30:00Z", 
          username: "johndoe",
          link: "https://github.com/johndoe/repo/commit/3",
          profilepic: "https://avatars.githubusercontent.com/u/123456?v=4"
        },
        {
          name: "Update README",
          date: "2024-09-28T12:30:00Z", 
          username: "johndoe",
          link: "https://github.com/johndoe/repo/commit/3",
          profilepic: "https://avatars.githubusercontent.com/u/123456?v=4"
        }
      ]
    ];

    return (
      <div className="activity-page">
        <div className="activity-page-container">
          <div className="commits-container">
            <h2>{`Общая активность за ${year} год`}</h2>
            <div className="commits-tile">
              <div className="commits-controls-container">
                <div className="controls-block year">
                  <p>Год</p>
                  <div className="flex1">
                    <SearchDropDown values={["2024","2025","2026"]} chosenOption={year} setChosenOption={setYear} emptyMessage={"Выберите год"}/>
                  </div>
                </div>
                <div className="controls-block member">
                  <p>Участник</p>
                  <div className="flex1">
                    <SearchDropDown values={["Kaelesty","Grigory the longest man","Leonid"]} chosenOption={chosenMember} setChosenOption={setChosenMember} emptyMessage={"Выберите участника"}/>
                  </div>
                </div>
                <div className="controls-block repo">
                  <p>Репозиторий</p>
                  <div className="flex1">
                    <SearchDropDown values={["audionautica-web","audionautica-backend","audionautica-android","audionautica-neuro",]} chosenOption={chosenRepo} setChosenOption={setChosenRepo} emptyMessage={"Выберите репозиторий"}/>
                  </div>
                </div>
              </div>
              <Activity/>
              <div className="commits">
                {commitData.map((commitList,i)=>(
                  <div key={i} >
                    <p>{`Коммиты за ${formatDate(commitData[i][0].date)}`}</p>
                    <div className="commits-date-container">
                      {commitData[i].map((commit,j)=>(
                        <Commit 
                          name={commit.name} 
                          date={commit.date} 
                          username={commit.username} 
                          link={commit.link} 
                          profilepic={commit.profilepic}
                          key={j}/>
                      ))}
                    </div>
                  </div>
                ))}
                
              </div>
            </div>
          </div>
          {lastActivityData.length !== 0 &&(
            <div className="last-activity-container">
              <h2>{`Последняя активность`}</h2>
              <div className="last-activity-tile">
                  {lastActivityData.map((data,index)=>(
                    <LastActivity 
                      date={data.date}
                      link={data.link} 
                      linkTo={data.linkTo}
                      text={data.text}
                      key={index}
                      />
                  ))}
                  
              </div>
            </div>
          )}
          <div className="sprints-container">
            <h2>{`Спринты`}</h2>
            <div className="sprints-tile">
              <button onClick={()=>navigate("/sprints/create/")}>Начать спринт</button>
              {sprints.map((sprint, index)=>(
                <div className="sprint" key={index}>
                  <div className="sprints-flex">
                    <p>{sprint.name}</p>
                    <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                  </div>
                  <div className="grad-separator"></div>
                </div>
              ))}
            </div>
          </div>
        </div>    
      </div>
      
    );
  }
  
  export default ActivityPage;
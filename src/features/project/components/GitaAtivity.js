import React, {useState} from "react"
import Commit from "./Commit"
import Activity from "./Activity"
import SearchDropDown from "features/shared/components/SearchDropDown"

function formatDate(date) {
    const dateParts = date.slice(0, 10).split('-'); 
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
    return formattedDate;
  }

const GitActivity = () => {
    const [year,setYear] = useState(2024)
  
    const [chosenMember,setChosenMember] = useState("Kaelesty") 
    const [chosenRepo,setChosenRepo] = useState("audionautica-web") 
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
      
    return(
      <div className="commits-container">
        <h2>{`Общая активность за ${year} год`}</h2>
        <div className="commits-tile">
          <div className="commits-controls-container"> 
            <div className="controls-block year">
              <p>Год</p>
              <div className="flex1">
                <SearchDropDown values={["2024","2025","2026","2027","2028","2029","2030"]} chosenOption={year} setChosenOption={setYear} emptyMessage={"Выберите год"}/>
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
    )
}

export default GitActivity
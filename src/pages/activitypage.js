import React, { useState } from "react";
import Activity from "../components/activity";
import "./activitypage.css"
import SearchDropDown from "../components/searchdropdown";

const ActivityPage = () => {
    const [year,setYear] = useState(2024)
    const [chosenMember,setChosenMember] = useState("Kaelesty") 
    const [chosenRepo,setChosenRepo] = useState("Audionautica-web") 

  
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
                <div>
                  <p>Коммиты за 17.09.2024</p>
                </div>
              </div>
            </div>
          </div>
          

        </div>          
      </div>
      
    );
  }
  
  export default ActivityPage;
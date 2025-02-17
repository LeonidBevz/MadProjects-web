import React from "react";
import "css/table.css"
import {  useNavigate } from "react-router-dom";
/*
import SearchDropDown from "features/shared/components/SearchDropDown";
import ConfirmIco from "images/conf";
*/

const Table = ({titles, data, onApprove = ()=>{}, onDeny = ()=>{}}) => {
  const navigate = useNavigate()
    /*
    const [ratings, setRatings] = useState(data.map(() => null))

    const updateRating = (index, newRating) => {
        const updatedRatings = [...ratings];
        updatedRatings[index] = newRating; 
        setRatings(updatedRatings); 
    };
    */

    return (
        <table>
          <thead>
            <tr>
              {titles.map((title, index)=>(<th key={index}>
                {title.name}
              </th>))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i)=>(<tr className={i%2===0 ? "bg1" : "bg2"} key={i}>
              {titles.map((_,j)=>(<td key={j}>
                {titles[j].type === "link" && <span className="link" onClick={()=>{navigate(row.linkto)}}>{row[titles[j].key]}</span>}
                {titles[j].type === "text" && <span>{row[titles[j].key]}</span>}
                {titles[j].type === "approve" && <div className="table-butt-flex">
                    <button className="approve-butt" onClick={()=>{onApprove(row)}}>Одобрить</button>    
                    <button className="deny-butt" onClick={()=>{onDeny(row)}}>Отклонить</button> 
                </div>}
                {/*titles[j].type === "rate" && <div className="table-rate-flex"> 
                    <div className="flex1">
                        <SearchDropDown values={["Отлично","Хорошо","Удовл.","Неуд."]} chosenOption={ratings[i]} setChosenOption={(newRating) => updateRating(i, newRating)} emptyMessage={"Оценка"}/> 
                    </div>
                    <button className="conf-butt" onClick={onRate}>
                        <ConfirmIco/>    
                    </button>
                </div>*/}
              </td>))}
            </tr>))}
          </tbody>
        </table>         
    );
  }
  
  export default Table;
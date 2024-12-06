import React, {useState} from "react";
import SearchDropDown from "features/shared/components/SearchDropDown";
import ConfirmIco from "images/conf";

const AnaliticsPage = ()=>{
    const [rate, setRate] = useState("Отлично")

    return(
        <div className="info-page">
            <div className="indo-container">
                <h2>Оценка</h2>
                <div className="info-tile info-tile-center" >
                    <div className="table-rate-flex">
                        <div className="flex1">
                          <SearchDropDown values={["Отлично","Хорошо","Удовлетв.","Неуд."]} chosenOption={rate} setChosenOption={setRate} emptyMessage={"Оценка"}/> 
                        </div>
                        <button className="conf-butt" onClick={()=>{}}>
                        <ConfirmIco/>    
                        </button>
                    </div>
                </div>
            </div>
            <div className="indo-container">
                <h2>Аналитика</h2>
                <div className="info-tile">
                    <iframe
                        src="/1.html"
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "frame1"
                    />
                    <iframe
                        src="/2.html"
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        title= "frame2"
                    />
                </div>
            </div>
            
        </div>
    )
}

export default AnaliticsPage
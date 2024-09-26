import React,{useState, useEffect} from "react";
import "./activity.css"

function getDayOfWeek(date) {
  const day = date.getDay();
  return (day + 6) % 7;
}
function getPercentile(arr, percentile) {
  const index = Math.floor((percentile / 100) * arr.length);
  return arr[index];
}
function getDateFromDayNumber(dayNumber,year){
  const isLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
  
  let targetYear = year;
  if (dayNumber < 0) {
    targetYear -= 1;
    dayNumber += (isLeapYear(targetYear) ? 366 : 365);
  } else if (dayNumber >= (isLeapYear(year) ? 366 : 365)) {
    targetYear += 1;
    dayNumber -= (isLeapYear(year) ? 366 : 365);
  }

  let date = new Date(targetYear, 0, 1);

  date.setDate(date.getDate() + dayNumber);
  return date
}

function getStrDateFromDayNumber(dayNumber, year) {
  const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  const date = getDateFromDayNumber(dayNumber,year)

  const day = date.getDate().toString().padStart(2, '0');
  const month = monthNames[date.getMonth()] 
  const yearString = date.getFullYear();

  return `${day} ${month} ${yearString}`;
}

function getCommitCountString(index, activities) {
  const commitCount = activities[index] || 0;

  const getCommitWord = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return "коммит";
    } else if ((count % 10 >= 2 && count % 10 <= 4) && !(count % 100 >= 12 && count % 100 <= 14)) {
      return "коммита";
    } else {
      return "коммитов";
    }
  };

  const commitWord = getCommitWord(commitCount);
  return `${commitCount} ${commitWord}`;
}
const getActivityWord = (count) => {
  const lastDigit = count % 10; 
  const lastTwoDigits = count % 100; 

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} активностей`;
  } else if (lastDigit === 1) {
    return `${count} активность`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} активности`;
  } else {
    return `${count} активностей`;
  }
};
const Activity = () => {
    const year = 2025
    const date = new Date(`${year}-01-01`); 
    const FirstJanDayOfWeek = getDayOfWeek(date);
    const [activities, setActivities] = useState({
      1: 57,
      3: 82,
      5: 76,
      6: 29,
      8: 89,
      9: 33,
      11: 92,
      12: 11,
      14: 24,
      15: 64,
      17: 68,
      18: 38,
      19: 95,
      21: 88,
      22: 84,
      24: 14,
      25: 66,
      27: 78,
      28: 57,
      29: 63,
      31: 77,
      32: 90,
      34: 27,
      35: 76,
      36: 99,
      38: 46,
      39: 85,
      41: 73,
      42: 60,
      44: 70,
      45: 60,
      47: 94,
      48: 15,
      50: 50,
      299: 81
    })
    const [Q,setQ]=useState([0,0,0])
    const [sum,setSum]=useState(0)
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const months = [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн','Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    

    useEffect(()=>{
      const activityValues = Object.values(activities);

      setSum(activityValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0))

      const sortedActivities = activityValues.sort((a, b) => a - b);
      setQ([getPercentile(sortedActivities, 25),getPercentile(sortedActivities, 50),getPercentile(sortedActivities, 75)])
    },[activities])

    const handleClick = (day) =>{
      console.log(getDateFromDayNumber(day, year))
    }

    const handleMouseEnter = (event) => {
      const tooltip = event.currentTarget.querySelector('.tooltip');
      const { clientWidth } = tooltip;

      const { left } = event.currentTarget.getBoundingClientRect();

      if (left - clientWidth/2 < 0){ //выходит за пределы слева
        tooltip.style.transform = `translateX(100%)`
      } 
      else if (left + clientWidth/2  > window.innerWidth) {//выходит за пределы справа
        tooltip.style.transform = `translateX(0%)`; 
      }
      else {
        tooltip.style.transform = `translateX(50%)`; 
      }
  
    };
    
    return (
      <div className="activity">
        <div className="act-container">
          <div className="act-mounth-container">
            {Array.from({ length: 12 }, (_, index) => (
              <p className="act-month" key={index}>{months[index]}</p>
            ))}
          </div>       
          <div className="act-grid-container">
            <div>
            {Array.from({ length: 7 }, (_, index) => (
              <p className="act-dayofweek" key={index}>{weekdays[index]}</p>
            ))}
            </div>
            {Array.from({ length: 54 }, (_, i) => (<div key={i}>
              {Array.from({ length: 7 }, (_, j) => (
                <div className={"grid-item " + 
                  (activities[i * 7 + j - FirstJanDayOfWeek] <= Q[0] ? 
                    "grid-item-25" :
                  activities[i * 7 + j - FirstJanDayOfWeek] > Q[0] && activities[i * 7 + j - FirstJanDayOfWeek] <= Q[1] ? 
                    "grid-item-50" :
                  activities[i * 7 + j - FirstJanDayOfWeek] > Q[1] && activities[i * 7 + j - FirstJanDayOfWeek] <= Q[2] ? 
                    "grid-item-75" : 
                  activities[i * 7 + j - FirstJanDayOfWeek] > Q[2] ?
                    "grid-item-100" :
                    "grid-item-0")
                  } 
                  onMouseEnter={(event) => handleMouseEnter(event)}
                  key={i * 7 + j - FirstJanDayOfWeek} 
                  onClick={() => handleClick(i * 7 + j - FirstJanDayOfWeek)}
                >
                  <div className="tooltip">
                    {`${getCommitCountString(i * 7 + j - FirstJanDayOfWeek, activities)} за ${getStrDateFromDayNumber(i * 7 + j - FirstJanDayOfWeek, year)}`}
                  </div>
                </div>
              ))}
            </div>))}
          </div>
        </div>
        <div className="act-bottom">
          <p className="activity-p">{`${getActivityWord(sum)} за год`}</p>
          <div className="act-bottom-right">
            <p>Меньше</p>
            {Array.from({ length: 5 }, (_, index) => (
                <div className={`nopoint grid-item ${
                  index === 0 ? "grid-item-0" :
                  index === 1 ? "grid-item-25" :
                  index === 2 ? "grid-item-50" :
                  index === 3 ? "grid-item-75" :
                  "grid-item-100"
                }`} 
                  key={index} 
                  />
              ))}
            <p>Больше</p>
          </div>
        </div>
      </div>
      
    );
  }
  
  export default Activity;
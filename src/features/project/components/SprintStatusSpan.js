import React from "react";

const SprintStatusSpan = ({sprint}) =>{
    const getWordEnding = (number, one, two, five) => {
      number = Math.abs(number) % 100;
      const n1 = number % 10;
      if (number > 10 && number < 20) return five;
      if (n1 > 1 && n1 < 5) return two;
      if (n1 === 1) return one;
      return five;
    };
    const getDaysText = (days) => `${days} д${getWordEnding(days, "ень", "ня", "ней")}`;

    const { actualEndDate, supposedEndDate } = sprint;

    const formatDate = (dateString) => new Date(dateString.split(".").reverse().join("-"));
    const today = new Date();
    const supposedEnd = formatDate(supposedEndDate);
    const actualEnd = actualEndDate ? formatDate(actualEndDate) : null;
  
    if (actualEnd) {
      // Спринт завершен
      const overdueDays = Math.ceil((actualEnd - supposedEnd) / (1000 * 60 * 60 * 24));
      if (overdueDays > 0) {
        return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-red-color)"}}>
          {`Завершён. Просрочен на ${getDaysText(overdueDays)}`}
        </span>;
      } else {
        return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-green-color)"}}>
          Завершён вовремя
        </span>
      }
    } else {
      // Спринт не завершен
      const daysLeft = Math.ceil((supposedEnd - today) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0) {
        return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200"}}>
          {`${getDaysText(daysLeft)} до дедлайна`}
        </span>
      } else if (daysLeft === 0) {
        return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "#ffc00a"}}>
          Сегодня дедлайн
        </span>
      } else {
        return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-red-color)"}}>
          {`Просрочен на ${getDaysText(Math.abs(daysLeft))}`}
        </span>
      }
    }
  }

  export default SprintStatusSpan
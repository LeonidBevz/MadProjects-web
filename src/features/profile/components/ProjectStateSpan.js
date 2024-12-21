import React from "react";

const ProjectStatusSpan = ({project}) =>{
    const { mark, status } = project;

    if (mark){
        switch (mark){
            case "5": 
                return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-green-color)"}}>
                    {`Оценен, отлично.`}
                </span>;
            case "4":
                return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-green-color)"}}>
                    {`Оценен, хорошо.`}
                </span>;
            case "3":
                return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "#ffc00a"}}>
                    {`Оценен, удовлетворительно.`}
                </span>;
            case "2":
                return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-red-color)"}}>
                    {`Оценен, неудовлетворительно.`}
                </span>;
        }
    }
    else if (status){
        switch (status){
            case "Pending":
                return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "#ffc00a"}}>
                    {`Ожидает одобрения.`}
                </span>;
            case "Unapproved":
                return <span style={{fontSize: "0.9rem", fontStyle: "italic", fontWeight: "200", color: "var(--main-red-color)"}}>
                    {`Отклонен.`}
                </span>;
        } 
    }
   
  }

  export default ProjectStatusSpan
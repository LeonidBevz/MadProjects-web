import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckIMG from "images/completedcheck.svg"

const ProjectCreated = () =>{
    const navigate = useNavigate()

    const onSkip = () =>{
        navigate("/profile")
    }

    useEffect(() => {
        const timer = setTimeout(() => {
          onSkip();
        }, 5000);
      
        return () => {
          clearTimeout(timer);
        };
        // eslint-disable-next-line
      }, []);

    return (
        <div className="sprint-page">   
            <h2>Создать проект</h2>
        
            <div className='info-tile git-auth-content' style={{height: "auto"}}>
                    
                    
                    <img src={CheckIMG} alt="Successful" style={{marginBottom: "20px"}}/>
                    <span className="text-git">Проект создан и отправлен на одобрение преподавателю!</span>
                    <span className="text-git"> Вы будете автоматически перенаправлены в профиль через 5 секунд.</span>
           
                    <button className="main-button" onClick={onSkip}>Продолжить</button>
                </div>
        </div>
    )
}

export default ProjectCreated
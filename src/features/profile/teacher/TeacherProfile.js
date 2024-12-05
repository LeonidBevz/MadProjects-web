import React, {useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RightArrowIco from "images/arrowrightico";
import CreateGroupModal from "features/profile/components/CreateGroupModal";
import "css/profilepage.css"
import { useTheme } from "features/shared/contexts/ThemeContext";

const TeacherProfilePage = () => {
    const {isNightTheme} = useTheme()
    const [data, setData] = useState({username: "Чернышев Станислав Андреевич", EmailLink: "example@gmail.com", rank: "Доцент, канд. тех. наук."})
    const [groups, setGroups] = useState(["Технологии программирования 2024"])
    const [modalWindow, setModalWindow] = useState(0)
    const navigate = useNavigate()
    
    const onGroupCreate = (name) =>{
        console.log("create group request", name)
        //if (response.status!==200)return 
        setGroups([name, ...groups]);
        setModalWindow(0)
    }
  
    return (
      <div className="profile-page page">
        <div className={modalWindow !==0 ? "bg-blur-shown" :"bg-blur-hidden"}/>
        {modalWindow === 1 && (<CreateGroupModal onCancel={()=>{setModalWindow(0)}} onConfirm={onGroupCreate}/>)}          
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    <div className="prifile-image">
                        <img className="profile-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="profile"/>
                        <Link to="edit/" >
                          <button className="profile-edit-but"/>
                        </Link>
                    </div>
                    <p className="profile-username">{data.username}</p>
                    <p>{data.rank}</p>
                </div>
                <div>
                    <div className="link-container">
                        <p>Email: </p>
                        <div className="profile-link">
                            <a href={`mailto:${data.EmailLink}`}>{data.EmailLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Группы проектов</h2>
            <div className="profile-projects">
            <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>{setModalWindow(1)}}>
                        <p>Создать группу...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                {groups.map((group, index)=>(<div className="profile-projects-item" key={index}>
                    <div className="profile-projects-content" onClick={()=>navigate(`/teacher/group/${group}/`)}>
                        <p>{group}</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>))}
            </div>
        </div>
      </div>
      
    );
  }
  
  export default TeacherProfilePage;
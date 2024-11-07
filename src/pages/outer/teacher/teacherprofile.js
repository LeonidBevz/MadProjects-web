import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import useToken from "../../../hooks/useToken";
import RightArrowIco from "../../../images/arrowrightico";
import "../../../css/profilepage.css"

const TeacherProfilePage = () => {
    const {isNightTheme} = useToken()
    const [data, setData] = useState({username: "Чернышев Станислав Андреевич", EmailLink: "example@gmail.com", rank: "Доцент, канд. тех. наук."})

    const navigate = useNavigate()
  
    return (
      <div className="profile-page">          
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    <div className="prifile-image">
                        <img className="profile-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="profile"/>
                        <Link to="/profile/edit/" >
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
                    <div className="profile-projects-content" onClick={()=>{}}>
                        <p>Создать группу...</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
                <div className="profile-projects-item">
                    <div className="profile-projects-content" onClick={()=>navigate("/teacher/group/Технологии программирования 2024/")}>
                        <p>Технологии программирования 2024</p>
                        <RightArrowIco className="profile-projects-content-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
                    </div>
                    <div className="profile-projects-separator"></div>
                </div>
            </div>
        </div>
      </div>
      
    );
  }
  
  export default TeacherProfilePage;
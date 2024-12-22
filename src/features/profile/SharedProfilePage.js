import React from "react";
import "css/profilepage.css"
import Loading from "features/shared/components/Loading";
import { useGetUserById } from "./hooks/useProfile";
import { useParams } from "react-router-dom";
import NotFoundPage from "features/shared/notfound";

const SharedProfilePage = () => {
    const { userId } = useParams()

    const { data, isLoading, error} = useGetUserById(userId)
    
    const handleGitClick = (link) =>{
      window.open(link, "_blank");
    }

    if (isLoading) {
        return(
            <div className="loading-page page">
                <Loading/>
            </div>
        )
    }
    if (error?.status === 404){
        return(
            <NotFoundPage/>
        )
    }
    if (error){
        return(
            <div>
                {`Ошибка загрузки ${error.status}`}
            </div>
        )
    }
  
    return (
      <div className="profile-page page">
        <div className="profile-page-content">
            <div className="profile-info">
                <div className="profile-pic-container">
                    <div className="prifile-image">
                        <img className="profile-pic" src={data.avatar ? data.avatar : "/baseProfilePic.png"} alt="profile"/>      
                    </div>
                    <p className="profile-username">{`${data.lastName} ${data.firstName} ${data.secondName}`}</p>
                    {data.role === "Common" && (
                        <p>Студент группы  <span>{data.data}</span></p>
                    )}
                   
                </div>
                <div>
                    {data.githubLink && (
                      <div className="link-container">
                        <p>GitHub: </p>
                        <div className="profile-link">
                            <a target="_blank" href={`${data.githubLink}`}>{data.githubLink}</a>
                            <div className="profile-sep"> </div>
                        </div>
                      </div>
                    )}
                    <div className="link-container">
                        <p>Email: </p>
                        <div className="profile-link">
                            <a href={`mailto:${data.email}`}>{data.email}</a>
                            <div className="profile-sep"> </div>
                        </div>
                    </div>
                </div>
            </div>          
        </div>
      </div>
      
    );
  }
  
  export default SharedProfilePage;
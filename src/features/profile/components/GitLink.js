import Loading from "features/shared/components/Loading";
import React from "react";
import GitLogo from "images/gitlogo.svg"
import { useAuth } from "features/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GitLink = ({data, isLoading, error}) =>{
    const {userId} = useAuth()
    const navigate = useNavigate()
    const handleGitAuth = async ()=>{
        navigate(`/git/auth?code=&state=${userId}`)
    }

    if (isLoading) {
        return (
            <Loading/>
        )
    }
    if (error && (error.status === 400 || error.status === 401 || error.status === 404))  {
        return (
          <div className="git-not-auth-container">
            <img className="git-logo" src={GitLogo} alt="GitHub" style={{marginTop: "15px"}}/>
            <span style={{marginBottom: "10px"}}> GitHub не втроризован.</span> 
            <button onClick={handleGitAuth}>Авторизовать</button>
          </div>
        )
    }
    else if (error){
        return (
            <div>
                {error.status}
            </div>
        )
    }

    return (
      <div className="link-container">
        <p>GitHub: </p>
        <div className="profile-link">
            <a href={data.profileLink}>{data.profileLink}</a>
            <div className="profile-sep"> </div>
        </div>
      </div>
    )
}

export default GitLink
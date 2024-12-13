import React from "react";
import GitLogo from "images/gitlogo.svg"
import { useAuth } from "features/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GitLink = ({data, isGitAuth}) =>{
    const {accessToken} = useAuth()
    const navigate = useNavigate()
    const handleGitAuth = async ()=>{
        navigate(`/git/auth?code=&state=${accessToken}`)
    }

    if (!isGitAuth)  {
        return (
          <div className="git-not-auth-container">
            <img className="git-logo" src={GitLogo} alt="GitHub" style={{marginTop: "15px"}}/>
            <span style={{marginBottom: "10px"}}> GitHub не втроризован.</span> 
            <button onClick={handleGitAuth}>Авторизовать</button>
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
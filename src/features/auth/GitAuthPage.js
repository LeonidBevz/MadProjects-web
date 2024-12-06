import React, {useEffect, useState} from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import GitAuthForm from "./components/GitAuthForm"
import Loading from "features/shared/components/Loading";
import useGitAuth from "./hooks/useGitAuth";
import GitAuthSuccessful from "./components/GitAuthCompleted";

const GitAuthPage = () =>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const jwt = queryParams.get("state");
    const jwtInt = parseInt(jwt)
    const navigate = useNavigate()


    const handleGitAuth = () =>{
        window.location.href = "https://github.com/login/oauth/authorize?client_id=Iv23liCiBaSIoD9dEHe6"+"&state="+jwt;
    }

    const { data, isLoading, error, isSuccess } = useGitAuth(code, jwtInt);

    useEffect(()=>{ 
        if (!isSuccess) return

        console.log("succ")          
        const timer = setTimeout(()=>{
            navigate('/profile/')
        },5000)

        return () => clearTimeout(timer);
    },[isSuccess])
    if (!jwt) return <div>No jwt provided!</div>
    if (isLoading) return <Loading/>;
    if (isSuccess) return <GitAuthSuccessful onSkip={()=>{navigate("/profile/")}}/>
    if (error) return <div>Ошибка: {error.message}</div>;

    
    return (<GitAuthForm onSubmit={handleGitAuth} onCancel={()=>{navigate("/profile")}}/>);
}

export default GitAuthPage
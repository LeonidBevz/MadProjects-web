import React, {useEffect} from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import GitAuthForm from "./components/GitAuthForm"
import Loading from "features/shared/components/Loading";
import useGitAuth from "./hooks/useGitAuth";
import GitAuthSuccessful from "./components/GitAuthCompleted";

const GitAuthPage = () =>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const state = queryParams.get("state");
    //state= userId
    const navigate = useNavigate()

    const handleGitAuth = () =>{
        window.location.href = `https://github.com/login/oauth/authorize?client_id=Iv23liCiBaSIoD9dEHe6&state=${state}`;
    }
    
    const { isLoading, error, isSuccess } = useGitAuth(code, state);

    useEffect(()=>{ 
        if (!isSuccess) return    
        const timer = setTimeout(()=>{
            navigate('/profile/')
    },5000)

        return () => clearTimeout(timer);
    },[isSuccess])

    if (!state) return <div>No state provided!</div>
    if (isLoading) return <Loading/>;
    if (isSuccess) return <GitAuthSuccessful onSkip={()=>{navigate("/profile/")}}/>
    if (error) return <div>Ошибка: {error.message}</div>;

    
    return (<GitAuthForm onSubmit={handleGitAuth} onCancel={()=>{navigate("/profile")}}/>);
}

export default GitAuthPage
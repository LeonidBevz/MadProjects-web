import React, {useEffect} from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import GitAuthForm from "./components/GitAuthForm"
import Loading from "features/shared/components/Loading";
import useGitAuth from "./hooks/useGitAuth";
import GitAuthSuccessful from "./components/GitAuthCompleted";

/* function generateCodeVerifier(length = 128) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

function base64urlencode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64urlencode(digest);
} */

const GitAuthPage = () =>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const state = queryParams.get("state");
    //state= userId
    const navigate = useNavigate()

    const handleGitAuth = async () =>{
       /*  const codeVerifier = generateCodeVerifier();
        sessionStorage.setItem("pkce_code_verifier", codeVerifier);

        const codeChallenge = await generateCodeChallenge(codeVerifier); */

        window.location.href = `https://github.com/login/oauth/authorize?` +
            new URLSearchParams({
                client_id: "Iv23liCiBaSIoD9dEHe6",
                redirect_uri: "https://mad-projects.ru/git/auth",
                state: state,
                allow_signup: "true",
                //code_challenge: codeChallenge,
                //code_challenge_method: "S256"
            });
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
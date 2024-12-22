import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ProfileRouting = ()=>{
    const role = localStorage.getItem("role")
    const navigate = useNavigate()

    useEffect(()=>{
        if (role ==="Curator"){
            navigate("/teacher/profile", { replace: true })
        }
        else if (role === "Common"){
            navigate("/student/profile", { replace: true })
        }
        else{
            navigate("/login")
        }
        // eslint-disable-next-line
    },[role])
    return (<></>)
}
export default ProfileRouting
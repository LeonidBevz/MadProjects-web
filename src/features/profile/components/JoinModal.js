import React, {useRef, useEffect, useState}  from "react";
import Loading from "features/shared/components/Loading";
import { useJoinProject } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";

const JoinModal = ({onCancel}) => {
    const container = useRef(null)
    const [code, setCode] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const {mutate, data,  isLoading, error} = useJoinProject()
    const navigate = useNavigate()

    useEffect(()=>{
      if (!error) return
      switch (error.status){
        case 404:
          setErrorMessage("Проект не найден!")
          return
        default:
          setErrorMessage("Что-то пошло не так")
          return
      }
    },[error])

    useEffect(()=>{
      if (!data) return
      navigate(`/${data.projectId}/activity/`)
      // eslint-disable-next-line
    },[data])

    useEffect(() => {
      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          onCancel();
        }
      };
      const handleClickOutside = (event) => {
        if (container.current  && !container.current.contains(event.target)) {
          onCancel();
        }
      };
  
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.removeEventListener('mousedown', handleClickOutside);
      };
      // eslint-disable-next-line
    }, []); 
  
    const handleValueChange = (event)=>{
      setCode(event.target.value);
    }

    const handleSubmit = async (event)=>{
      event.preventDefault()
      if (code.trim()===""){
        setErrorMessage("Пустая строка")
        return
      }
      mutate({code: code.trim()})
    }
    return (
      <div className="settings-modal z15-level" ref={container}>
        <form onSubmit={handleSubmit}>
        <h2 className="modal-edit-text" style={{padding: "0"}}>Присоединиться к проекту</h2>
        <p>Введите пригласительный код, который вы получили от создателя проекта</p>
        {isLoading && (<Loading/>)}
        {!isLoading && (<>
          <input
            value={code}
            onChange={handleValueChange}
            maxLength={128}
            placeholder="Введите код"
            style={{marginBottom: "15px", marginTop: "0"}}
            required
          />
          {errorMessage && (<p className="error-message">{errorMessage}</p>)}
         
          <div className="settings-flex-butt">
            <button type="submit">Присоединиться</button>
            <button type="button" onClick={onCancel}>Отмена</button>
          </div>
        </>)}
        
        </form>
      </div>
    )
  }

export default JoinModal
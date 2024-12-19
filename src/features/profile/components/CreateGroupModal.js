import React, {useRef, useEffect, useState}  from "react";
import { useCreateProjectsGroup } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";

const CreateGroupModal = ({ onConfirm, onCancel}) => {
    const container = useRef(null)
    const [newGroup, setNewGroup] = useState("")
    const inputRef = useRef(null)
    const [errorMessage, setErrorMessage] = useState("")

    const {mutate, isLoading, error, isSuccess} = useCreateProjectsGroup()
      
    useEffect(()=>{
      if (!error) return
      setErrorMessage("Что-то пошло не так", error.status)
    },[error])

    useEffect(()=>{
      if (!isSuccess) return
      onConfirm()
      // eslint-disable-next-line
    },[isSuccess])

    useEffect(() => {
      if (inputRef.current){
        inputRef.current.focus()
      }
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

    const handleValueChange = (e) =>{
      setNewGroup(e.target.value)
    }

    const handleConfirm = () =>{
      if (newGroup.trim()===""){
        setErrorMessage("Пустая строка!")
        return
      }
      mutate({title: newGroup})
    }
  
    return (
      <div className="settings-modal z15-level" ref={container}>
        <h2>Создать группу проектов</h2>
        <span>В созданную группу студенты будут предлагать темы проектов.</span>
        <input
          value={newGroup}
          onChange={handleValueChange}
          maxLength= {64}
          ref={inputRef}
          placeholder="Технологии программирования 2024"
          required
        />
        {errorMessage && (<p className="error-message">{errorMessage}</p>)}
        {isLoading && (<Loading/>)}
        {!isLoading && (
          <div className="settings-flex-butt">
            <button onClick={handleConfirm}>Подтвердить</button>
            <button onClick={onCancel}>Отмана</button>
          </div>
        )}
        
      </div>
    )
}
export default CreateGroupModal

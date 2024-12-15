import React, {useRef, useEffect, useState}  from "react";
import { useVerifyRepo } from "features/profile/hooks/useProfile";
import Loading from "./Loading";

const NewRepoModal = ({onConfirm, onCancel}) => {
    const container = useRef(null)
    const [newRepo, setNewRepo] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const {mutate, isLoading, error, isSuccess} = useVerifyRepo()

    useEffect(()=>{
      if (!error) return
      switch (error.status){
        case 404: 
          setErrorMessage("Репозиторий не найден, проверьте приватность")
          return
        case 425:
          setErrorMessage("Не авторизован GitHub!")
          return
        default:
          setErrorMessage("Что-то пошло не так")
          return
      }
    },[error])

    useEffect(()=>{
      if (!isSuccess) return

      onConfirm(newRepo)
       // eslint-disable-next-line
    },[isSuccess])

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
      setNewRepo(event.target.value);
    }

    const handleSubmit = async (event)=>{
      event.preventDefault()
      if (newRepo.trim()===""){
        setErrorMessage("Пустая строка")
        return
      }
      mutate(newRepo.trim())
    }
    return (
      <div className="settings-modal z15-level" ref={container}>
        <form onSubmit={handleSubmit}>
        <h2 className="modal-edit-text" style={{padding: "0"}}>Добавить репозиторий</h2>
        {isLoading && (<Loading/>)}
        {!isLoading && (<>
          <input
            value={newRepo}
            onChange={handleValueChange}
            maxLength={128}
            placeholder="https://github.com/userName/MyBestProject"
            style={{marginBottom: "15px"}}
            required
          />
          {errorMessage && (<p className="error-message">{errorMessage}</p>)}
         
          <div className="settings-flex-butt">
            <button type="submit">Создать</button>
            <button type="button" onClick={onCancel}>Отмана</button>
          </div>
        </>)}
        
        </form>
      </div>
    )
  }

export default NewRepoModal
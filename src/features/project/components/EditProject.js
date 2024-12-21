import React, {useRef, useEffect, useState}  from "react";
import { usePostProjectData } from "../hooks/useProject";
import { useProjectContext } from "../contexts/ProjectContext";
import Loading from "features/shared/components/Loading";
import { useNotifications } from "features/shared/contexts/NotificationsContext";

const EditProjectModal = ({onConfirm, onCancel, newTitle, newDescription, setNewTitle, setNewDescription}) => {
    const container = useRef(null)
    const {projectData, refetch} = useProjectContext()
    const [errorMessage, setErrorMessage] = useState("")
    const { mutate, isLoading, error, isSuccess } = usePostProjectData()
    const { addNotification } = useNotifications()

    useEffect(()=>{
      if (!error) return
      setErrorMessage("Error ", error.status)
    },[error])

    useEffect(()=>{
      if (!isSuccess) return
      addNotification("Данные успешно обновлены", "success")
      refetch()
      onConfirm()
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
  
    const handleTitleChange = (event)=>{
      setNewTitle(event.target.value);
    }
    const handleDescriptionChange = (event)=>{
      setNewDescription(event.target.value);
    }
    const handleSubmit = (event)=>{
      event.preventDefault();
      const isTitleDiff = projectData.title !== newTitle
      const isDescDiff = projectData.desc !== newDescription
      if ( !(isTitleDiff || isDescDiff) ) {
        setErrorMessage("Изменения не выявлены")
        return
      }
      const data = {
        projectId: projectData.id,
        title: isTitleDiff ? newTitle : null,
        desc: isDescDiff ? newDescription : null
      }
      mutate(data)
    }
    

    return (
      <div className="settings-modal z15-level" ref={container}>
        <form onSubmit={handleSubmit}>
          <h2 className="modal-edit-text">Название</h2>
          <input
            value={newTitle}
            onChange={handleTitleChange}
            maxLength={32}
            required
          />
          <h2>Описание</h2>
          <textarea
            value={newDescription}
            onChange={handleDescriptionChange}
            maxLength={1000}
            required
          />
          {errorMessage && (<p className="error-message">{errorMessage}</p>)}
          {isLoading && (<Loading/>)}
          {!isLoading && (
            <div className="settings-flex-butt">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={onCancel}>Отмена</button>
            </div>
          )}
          
        </form>
      </div>
    )
  }

export default EditProjectModal
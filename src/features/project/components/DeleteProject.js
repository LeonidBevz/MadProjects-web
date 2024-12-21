import React, {useRef, useEffect, useState}  from "react";

const DeleteProjectModal = ({onConfirm, onCancel}) => {
    const container = useRef(null)
    const [confirmText, setConfirmText] = useState("")
    const [isDeleteAvailible, setIsDeleteAvailible] = useState(false)

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
      setConfirmText(event.target.value);
      setIsDeleteAvailible(event.target.value === "Подтверждаю")
    }

    const handleSubmit = (event)=>{
      event.preventDefault()
      if (!isDeleteAvailible){
        return
      }
      onConfirm()
    }
    return (
      <div className="settings-modal z15-level" ref={container}>
        <form onSubmit={handleSubmit}>
        <h2 className="modal-edit-text">Внимание!</h2>
        <p>Данное действие удалит проект и все его данные! <br/> Для продолжения введите "Подтверждаю"</p>
        <input
          value={confirmText}
          onChange={handleValueChange}
          maxLength={16}
          required
        />
        <div className="settings-flex-butt">
          <button className={isDeleteAvailible ? "active-del-butt" : "blocked-del-butt"} type="submit">Удалить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
        </form>
      </div>
    )
  }

export default DeleteProjectModal
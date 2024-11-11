import React, {useRef, useEffect}  from "react";

const EditProjectModal = ({onConfirm, onCancel, newTitle, newDescription, setNewTitle, setNewDescription}) => {
    const container = useRef(null)

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
      onConfirm()
    }
    return (
      <div className="settings-modal" ref={container}>
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
  
          <div className="settings-flex-butt">
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onCancel}>Отмана</button>
          </div>
        </form>
      </div>
    )
  }

export default EditProjectModal
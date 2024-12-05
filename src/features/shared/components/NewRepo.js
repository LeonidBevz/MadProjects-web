import React, {useRef, useEffect}  from "react";

const NewRepoModal = ({onConfirm, onCancel, newRepo, setNewRepo}) => {
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
  
    const handleValueChange = (event)=>{
      setNewRepo(event.target.value);
    }

    const handleSubmit = (event)=>{
      event.preventDefault()
      onConfirm()
    }
    return (
      <div className="settings-modal" ref={container}>
        <form onSubmit={handleSubmit}>
        <h2 className="modal-edit-text">Добавить репозиторий</h2>
        <input
          value={newRepo}
          onChange={handleValueChange}
          maxLength={16}
          placeholder="user/abobagame"
          required
        />
        <div className="settings-flex-butt">
          <button type="submit">Создать</button>
          <button type="button" onClick={onCancel}>Отмана</button>
        </div>
        </form>
      </div>
    )
  }

export default NewRepoModal
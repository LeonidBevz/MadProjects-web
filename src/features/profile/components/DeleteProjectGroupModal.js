import React, {useRef, useEffect}  from "react";

const DeletePGModal = ({name, onDelete, onCancel}) => {
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
  
    return (
      <div className="delete-modal z15-level" ref={container}>
        <p>{`Вы уверены что хотите удалить группу ${name}?`}</p>
        <div className="flex-butt">
          <button className="deletem-button" onClick={onDelete}>Подтвердить</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    )
}

export default DeletePGModal
import React, {useRef, useEffect}  from "react";

const EditModal = ({text, onConfirm, onCancel, newValue, setNewValue, isRowEdit}) => {
    const inputRef = useRef()
    const container = useRef(null)
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
  
    const handleValueChange = (event)=>{
      setNewValue(event.target.value);
    }
    const handleSubmit = (event)=>{
      event.preventDefault();
      onConfirm()
    }
    return (
      <div className="delete-modal z15-level" ref={container}>
        <form onSubmit={handleSubmit}>
        <p className="modal-edit-text">{text}</p>
        <textarea 
          value={newValue}
          onChange={handleValueChange}
          maxLength={isRowEdit ? 25 : 50}
          ref={inputRef}
          required
        />
        <div className="flex-butt">
          <button type="submit">Подтвердить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
        </form>
      </div>
    )
  }

export default EditModal
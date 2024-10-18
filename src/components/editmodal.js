import React, {useRef, useEffect}  from "react";

const EditModal = ({text, onConfirm, onCancel, newValue, setNewValue}) => {
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
      <div className="delete-modal bg-trans" ref={container}>
        <form onSubmit={handleSubmit}>
        <p className="modal-edit-text">{text}</p>
        <textarea 
          className="all-trans"
          value={newValue}
          onChange={handleValueChange}
          maxLength={64}
          ref={inputRef}
          required
        />
        <div className="flex-butt">
          <button type="submit" className="all-trans">Подтвердить</button>
          <button type="button" className="all-trans" onClick={onCancel}>Отмана</button>
        </div>
        </form>
      </div>
    )
  }

export default EditModal
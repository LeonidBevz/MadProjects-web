import React, {useRef, useEffect, useState}  from "react";

const ProfessorMessage = ({onConfirm, onCancel}) => {
    const container = useRef(null)
    const [message, setMessage] = useState("")

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
      setMessage(event.target.value);
    }

    const handleSubmit = async (event)=>{
      event.preventDefault()
      onConfirm(message)      
    }
    return (
      <div className="settings-modal" ref={container}>
        <form onSubmit={handleSubmit}>
        <h2 className="modal-edit-text" style={{paddingBottom: "10px"}}>Комментарий преподавателя</h2>
        <span>Здесь можно указать причину отказа, а можно и не указывать.</span>
        <textarea
          value={message}
          onChange={handleValueChange}
          maxLength={1000}
          placeholder="Комментарий"
          style={{marginBottom: "15px"}}
        />
    
        <div className="settings-flex-butt">
          <button type="submit">Отправить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>        
        </form>
      </div>
    )
  }

export default ProfessorMessage
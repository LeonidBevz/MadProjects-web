import React, {useRef, useEffect, useState}  from "react";

const CreateGroupModal = ({ onConfirm, onCancel}) => {
    const container = useRef(null)
    const [newGroup, setNewGroup] = useState("")
    const inputRef = useRef(null)
  
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
  
    return (
      <div className="settings-modal" ref={container}>
        <h2>Создать группу проектов</h2>
        <span>В созданную группу студенты будут предлагать темы проектов.</span>
        <input
          value={newGroup}
          onChange={handleValueChange}
          maxLength= {25}
          ref={inputRef}
          placeholder="Технологии программирования 2024"
          required
        />
        <div className="settings-flex-butt">
          <button onClick={()=>onConfirm(newGroup)}>Подтвердить</button>
          <button onClick={onCancel}>Отмана</button>
        </div>
      </div>
    )
}
export default CreateGroupModal

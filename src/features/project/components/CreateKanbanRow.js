import React, { useState, useEffect, useRef } from 'react';

const standardColors = [
    '#FFFF78', '#7878FF', '#78F1FF', '#78FF78'
  ];

const CreateRowModal = ({onCancel = () => {}, onConfirm= () => {}})=>{
    const container = useRef(null)
    const [newName, setNewName] = useState()

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
    const [chosenColor, setChosenColor] = useState("#FFFF78")
    const [customColor, setCustomColor] = useState('#FFAAFF'); 

    const handleStandardColorClick = (color) => {
        setChosenColor(color)
    };
  
    const handleCustomColorChange = (e) => {
      setCustomColor(e.target.value);
      setChosenColor(e.target.value)
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    }

    const handleSubmit = () =>{
        if (newName.trim()){
            onConfirm(newName, chosenColor)
            return
        }
    }
    
    return (
      <div className="delete-modal z15-level" ref={container}>
        <p className="modal-edit-text">Название нового столбца</p>
        <textarea 
          value={newName}
          onChange={handleNameChange}
          maxLength={ 25 }
          placeholder='Название столбца'
        />
       <p >Выберите цвет:</p>
       <div className="standard-colors">
        {standardColors.map((color) => (
          <div
            key={color}
            className="color-box"
            style={color === chosenColor ? { backgroundColor: color, border: "1px solid var(--border-color)", outline:"2px solid green" }:{ backgroundColor: color, border: "1px solid var(--border-color)" }}
            onClick={() => handleStandardColorClick(color)}
          ></div>
        ))}
      </div>
      <p>Или выберите свой цвет:</p>

      <div className="custom-color">
        <input
          type="color"
          className='color-input'
          value={customColor}
          onChange={handleCustomColorChange}
          style={customColor === chosenColor? {outline:"2px solid green"} : {}}
        />
      </div>
        <div className="flex-butt">
          <button type="submit" onClick={handleSubmit}>Подтвердить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
      </div>
    )
}

export default CreateRowModal
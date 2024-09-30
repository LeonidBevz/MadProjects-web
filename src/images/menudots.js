import React, {useState,useRef, useEffect} from "react";

const MenuDotsIco = ({ color = "white", className = "", onEdit = ()=>{}, onDelete= ()=>{}}) => {
  const [isMenuOpen,setIsMenuOpen] = useState()
  const buttonRef = useRef()
  const menuRef = useRef()

  const handleDelete = () =>{
    setIsMenuOpen(false)
    onDelete()
  }  
  const handleEdit = () =>{
    setIsMenuOpen(false)
    onEdit()
  }  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current  && buttonRef.current && !(menuRef.current.contains(event.target) || buttonRef.current.contains(event.target))) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return(
    <div className="drop-menu">
      <svg className = {`${className} svg-trans`} onClick={()=>setIsMenuOpen(!isMenuOpen)} ref={buttonRef} viewBox="0 0 36 35" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.6981 6.198C16.2873 6.198 15.1436 7.3406 15.1436 8.75008C15.1436 10.1596 16.2873 11.3022 17.6981 11.3022H17.7127C19.1235 11.3022 20.2672 10.1596 20.2672 8.75008C20.2672 7.3406 19.1235 6.198 17.7127 6.198H17.6981ZM15.1436 17.5001C15.1436 16.0906 16.2873 14.948 17.6981 14.948H17.7127C19.1235 14.948 20.2672 16.0906 20.2672 17.5001C20.2672 18.9096 19.1235 20.0522 17.7127 20.0522H17.6981C16.2873 20.0522 15.1436 18.9096 15.1436 17.5001ZM15.1436 26.2501C15.1436 24.8406 16.2873 23.698 17.6981 23.698H17.7127C19.1235 23.698 20.2672 24.8406 20.2672 26.2501C20.2672 27.6596 19.1235 28.8022 17.7127 28.8022H17.6981C16.2873 28.8022 15.1436 27.6596 15.1436 26.2501Z"/>
      </svg>
      {isMenuOpen && (<div className="ddmenu" ref={menuRef} draggable="false">
        <button onClick={handleEdit}>Редактировать</button>
        <button className="delete-button" onClick={handleDelete}>Удалить</button>
      </div>
      )}
    </div>
    )
  };
  
  export default MenuDotsIco;
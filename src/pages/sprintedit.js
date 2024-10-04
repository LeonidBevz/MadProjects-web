import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChoseManyDropDown from "../components/chosemanudd";

const SprintEditPage = () => {
    const location = useLocation();
    const {name, description, endDate} = location.state || {}
    const [newName,setNewName] = useState(name)
    const [newDescription,setNewDescription] = useState(description)
    const [newEndDate, setNewEndDate] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const today = new Date().toISOString().split('T')[0];
    const [chosenCards,setChosenCards] = useState([])
    const [cards,setCards] = useState([
      {
        rowName: "В работе",
        id: "row1",
        cards: [
          { name: "Фикс поиска", id: "card1", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
          { name: "Фикс поиска2", id: "card2", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        ],
      },
      {
        rowName: "Завершено",
        id: "row2",
        cards: [
          
          { name: "Фикс поиска4", id: "card4", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        ],
      },
    ])
    const formattedCards = cards.flatMap(row =>
      row.cards.map(card => (`${card.name} (${row.rowName})`))
    );

    useEffect(()=>{
      if (!description){
        console.log("fetch-server-for-data")
      }
      if (endDate){
        setNewEndDate(endDate.slice(0,10))
      }
    },[])

    const handleSubmit = (event)=>{
      event.preventDefault()
    }
    const handleNameChange = (event) => {
      setNewName(event.target.value);
    }
    const handleDateChange = (event) => {
      setNewEndDate(event.target.value);
    }
    const handleDescriptionChange = (event) => {
      setNewDescription(event.target.value);
    }
    return (
      <div className="sprint-page">          
        <h2  className="cl-trans">Редактировать спринт</h2>
        <div className="edit-container">
          <form onSubmit={handleSubmit}>
            <div className="flex-edit">
              <div className="name-cont">
                  <label className="cl-trans">Название</label>
                  <input
                    placeholder="Укажите название"
                    value={newName}
                    onChange={handleNameChange}
                    maxLength={64}
                    required
                  />
              </div>
              <div className="date-cont"> 
                  <label className="cl-trans">Дата завершения</label>
                  <input
                    placeholder="Укажите дату"
                    type="date"
                    value={newEndDate}
                    onChange={handleDateChange}
                    min={today}
                    max="2100-01-01" 
                    required
                  />
              </div>
            </div>
            <div>
                <label className="cl-trans">Описание</label>
                <textarea
                  className="all-trans"
                  placeholder="Укажите описание"
                  value={newDescription}
                  onChange={handleDescriptionChange}
                  required
                />
            </div>
            <div>
              <label className="cl-trans">Задачи</label>
              <ChoseManyDropDown values={formattedCards} selectedValues={chosenCards} setSelectedValues={setChosenCards} emptyMessage={"Выберите задачи"}/>
            </div>
            {errorMessage && (<p className="error-message">{errorMessage}</p>)}
            <div className="flex-buttons">
              <button className= "login-but" type="submit">Сохранить</button>
              <button className= "login-but" type="button">Отмена</button>
            </div>
          </form>
        </div>
      </div>
      
    );
  }
  
  export default SprintEditPage;
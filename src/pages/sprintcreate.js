import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChoseManyDropDown from "../components/chosemanudd";

const SprintCreatePage = () => {
    const [newName,setNewName] = useState("")
    const [newDescription,setNewDescription] = useState("")
    const [newEndDate, setNewEndDate] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const today = new Date().toISOString().split('T')[0];
    const [chosenCards, setChosenCards] = useState([])
    const navigate = useNavigate()
    const [cards, setCards] = useState([
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
        <h2  className="cl-trans">Создать спринт</h2>
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
              <button className= "login-but" type="submit">Создать</button>
              <button className= "login-but" type="button" onClick={()=>{navigate(-1)}}>Отмена</button>
            </div>
          </form>
        </div>
      </div>
      
    );
  }
  
  export default SprintCreatePage;
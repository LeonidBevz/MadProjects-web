import React, {  useState } from "react";
import MenuDotsIco from "../images/menudots";
import "./kanbanpage.css";
import useToken from "../hooks/useToken";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import PlusIco from "../images/plus";

function formatDate(date) {
  const dateParts = date.slice(0, 10).split('-'); 
  const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
  return formattedDate;
}
const DeleteModal = ({text, onDelete, onCancel}) => {
  return (
    <div className="delete-modal bg-trans">
      <p>{text}</p>
      <div className="flex-butt">
        <button className="deletem-button" onClick={onDelete}>Подтвердить</button>
        <button className="all-trans" onClick={onCancel}>Отмана</button>
      </div>
    </div>
  )
}
const KanbanPage = () => {
  const { username, isNightTheme } = useToken();
  const [isDeleteWindowShown, setIsDeleteWindowShown] = useState(0)
  const [rowToDelete, setRowToDelete] = useState(null)
  const [cardToDelete, setCardToDelete] = useState(null)
  const [cards, setCards] = useState([
    {
      rowName: "Пример1",
      id: "row1",
      cards: [
        { name: "Фикс поиска", id: "card1", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        { name: "Фикс поиска", id: "card2", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
      ],
    },
    {
      rowName: "Пример2",
      id: "row2",
      cards: [
        { name: "Фикс поиска", id: "card3", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        { name: "Фикс поиска", id: "card4", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
      ],
    },
  ]);

  const [rowsCount,setRowsCount] = useState(cards.length)
  const [cardsCount,setCardsCount] = useState(cards.reduce((total, row) => total + row.cards.length, 0))
  
  const addColumn = () =>{
    const newId = (rowsCount + 1).toString(); 
    setRowsCount(rowsCount + 1)
    const newColumn = {
      rowName: `Столбец${newId}`,
      id: newId,
      cards: [], 
    };
    setCards((prevCards) => [...prevCards, newColumn]);
  }
  const addCard = (rowIndex) =>{
    setCardsCount(cardsCount+1)
    const newCardId = `card${cardsCount + 1}`
    
    const newCard = {
      name: `Карточка ${newCardId}`,
      id: newCardId,
      author: username, 
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
  
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[rowIndex].cards.push(newCard); 
      return updatedCards;
    });
  }
  const deleteRow = (rowId) => {
    const updatedCards = [...cards];
    updatedCards.splice(rowId, 1);
    setCards(updatedCards);
    setIsDeleteWindowShown(0)
  };
  const handleDeleteRowClick = (rowId)=>{
    setRowToDelete(rowId)
    setIsDeleteWindowShown(1)
  }

  const deleteCard = (rowIndex, cardIndex) => {
    setCards((prevCards) =>
      prevCards.map((row, i) => {
        if (i === rowIndex) {
          const newCards = row.cards.filter((_, j) => j !== cardIndex);
          
          return { ...row, cards: newCards };
        }
        return row;
      })
    );
    setIsDeleteWindowShown(0)
  };
  const handleDeleteCardClick = (rowId, cardId)=>{
    setRowToDelete(rowId)
    setCardToDelete(cardId)
    setIsDeleteWindowShown(2)
  }
 

  const [isDragging, setIsDragging] = useState(false); // Для блокирования одновременного перетаскивания

  const onDragStart = () => {
    setIsDragging(true); 
  };

  const onDragEnd = (result) => {
    setIsDragging(false); 

    const { destination, source, type } = result;

    // Если нет места назначения
    if (!destination) {
      return;
    }

    // Перемещение столбцов
    if (type === "column") {
      const newColumnOrder = Array.from(cards);
      const [movedColumn] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, movedColumn);
      setCards(newColumnOrder);
      return;
    }

    // Перемещение карточек
    const startColumnIndex = source.droppableId;
    const finishColumnIndex = destination.droppableId;

    const startColumn = cards.find((col) => col.id === startColumnIndex);
    const finishColumn = cards.find((col) => col.id === finishColumnIndex);

    if (startColumn === finishColumn) {
      const newCardOrder = Array.from(startColumn.cards);
      const [movedCard] = newCardOrder.splice(source.index, 1);
      newCardOrder.splice(destination.index, 0, movedCard);

      const newColumn = {
        ...startColumn,
        cards: newCardOrder,
      };

      setCards((prevCards) =>
        prevCards.map((col) =>
          col.id === newColumn.id ? newColumn : col
        )
      );
      return;
    }

    // Если карточка перемещается в другую колонку
    const startCardOrder = Array.from(startColumn.cards);
    const [movedCard] = startCardOrder.splice(source.index, 1);

    const finishCardOrder = Array.from(finishColumn.cards);
    finishCardOrder.splice(destination.index, 0, movedCard);

    const newStartColumn = {
      ...startColumn,
      cards: startCardOrder,
    };

    const newFinishColumn = {
      ...finishColumn,
      cards: finishCardOrder,
    };

    setCards((prevCards) =>
      prevCards.map((col) =>
        col.id === newStartColumn.id ? newStartColumn : col.id === newFinishColumn.id ? newFinishColumn : col
      )
    );
  };

  return (
    <div className="kanban-page">
      <div className={isDeleteWindowShown !==0 ? "bg-blur-shown" :"bg-blur-hidden"}/>
      {isDeleteWindowShown === 1 && (<DeleteModal onDelete={()=>deleteRow(rowToDelete)} text={`Вы уверены что хотите удалить столбец ${cards[rowToDelete].rowName} с ${cards[rowToDelete].cards.length} карточками?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 2 && (<DeleteModal onDelete={()=>deleteCard(rowToDelete,cardToDelete)} text={`Вы уверены что хотите удалить карточку ${cards[rowToDelete].cards[cardToDelete].name}?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="kanban-main-container">
              {cards.map((row, i) => (
                <Draggable draggableId={row.id} index={i} key={row.id} isDragDisabled={isDragging}>
                  {(provided) => (
                    <div {...provided.draggableProps} ref={provided.innerRef} className="kanban-row">
                      <div className="kanban-row-top bg-trans" {...provided.dragHandleProps}>
                        <p>{row.rowName}</p>
                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" onDelete={()=>handleDeleteRowClick(i)} />
                      </div>
                      <Droppable droppableId={row.id} type="card">
                        {(provided) => (
                          <div className="cards-container" ref={provided.innerRef} {...provided.droppableProps}>
                            {row.cards.map((card, j) => (
                              <Draggable draggableId={card.id} index={j} key={card.id} isDragDisabled={isDragging}>
                                {(provided) => (
                                  <div className="kanban-card bg-trans" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <div className="card-top">
                                      <p className="card-name">{card.name}</p>
                                      <div className="more-butt" >
                                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" onDelete={()=>handleDeleteCardClick(i,j)}/>
                                      </div>
                                    </div>
                                    <p className="card-info">{`Автор: ${card.author}`}</p>
                                    <p className="card-info">{`Создано: ${formatDate(card.created)}`}</p>
                                    <p className="card-info">{`Изменено: ${formatDate(card.updated)}`}</p>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <div className="kanban-row">
                              <div className="kanban-row-top bg-trans pointer" onClick={()=>addCard(i)}>
                                <p className="kanban-add-text">Добавить карточку</p>
                                <PlusIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots"/>
                              </div>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="kanban-row">
                <div className="kanban-row-top bg-trans pointer" onClick={addColumn}>
                  <p>Добавить столбец</p>
                  <PlusIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots"/>
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanPage;
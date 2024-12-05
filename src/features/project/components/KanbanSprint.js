import React, { useState } from "react";
import MenuDotsIco from "images/menudots";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { useTheme } from "features/shared/contexts/ThemeContext";

function formatDate(date) {
  const dateParts = date.slice(0, 10).split('-'); 
  const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
  return formattedDate;
}

const Kanban = ({cards, setCards}) => {
  const { isNightTheme } = useTheme();
  const [isDeleteWindowShown, setIsDeleteWindowShown] = useState(0)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [cardToEdit, setCardToEdit] = useState(null)
  const [newName, setNewName] = useState("")


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
    setRowToEdit(rowId)
    setCardToEdit(cardId)
    setIsDeleteWindowShown(2)
  }

  const handleEditCardClick = (rowId,cardId) =>{
    setRowToEdit(rowId)
    setCardToEdit(cardId)
    setNewName(cards[rowId].cards[cardId].name)
    setIsDeleteWindowShown(4)
  }

  const setCardName = (rowId, cardId, newName) =>{
    console.log(rowId,cardId,newName)
    setCards((prevCards) =>
      prevCards.map((row, i) =>
        i === rowId
          ? {
              ...row,
              cards: row.cards.map((card, j) =>
                j === cardId ? { ...card, name: newName, updated: new Date().toISOString()} : card
              ),
            }
          : row
      )
    );
    setIsDeleteWindowShown(0)
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
    <div className="kanban">
      <div className={isDeleteWindowShown !==0 ? "bg-blur-shown" :"bg-blur-hidden"}/>
      {isDeleteWindowShown === 2 && (<DeleteModal onDelete={()=>deleteCard(rowToEdit,cardToEdit)} text={`Вы уверены что хотите удалить из спринта карточку ${cards[rowToEdit].cards[cardToEdit].name}?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 4 && (<EditModal onConfirm={()=>setCardName(rowToEdit, cardToEdit, newName)} newValue={newName} setNewValue={setNewName} text={`Введите название карточки: `} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="kanban-main-container kanban-sprint">
              {cards.map((row, i) => (
                <Draggable draggableId={row.id} index={i} key={row.id} isDragDisabled={isDragging}>
                  {(provided) => (
                    <div {...provided.draggableProps} ref={provided.innerRef} className="kanban-row">
                      <div className="kanban-row-top" {...provided.dragHandleProps}>
                        <p className="drag">{row.rowName}</p>
                      </div>
                      <Droppable droppableId={row.id} type="card">
                        {(provided) => (
                          <div className="cards-container kanban-sprint" ref={provided.innerRef} {...provided.droppableProps}>
                            {row.cards.map((card, j) => (
                              <Draggable draggableId={card.id} index={j} key={card.id} isDragDisabled={isDragging}>
                                {(provided) => (
                                  <div className="kanban-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <div className="card-top">
                                      <p className="card-name" onClick={()=>{handleEditCardClick(i,j)}}>{card.name}</p>
                                      <div className="more-butt" >
                                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" onDelete={()=>handleDeleteCardClick(i,j)} onEdit={()=>handleEditCardClick(i,j)}/>
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
                            
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
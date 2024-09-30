import React, { useEffect, useState } from "react";
import MenuDotsIco from "../images/menudots";
import "./kanbanpage.css";
import useToken from "../hooks/useToken";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function formatDate(date) {
  const dateParts = date.slice(0, 10).split('-'); 
  const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
  return formattedDate;
}

const KanbanPage = () => {
  const { isNightTheme } = useToken();
  const [cards, setCards] = useState([
    {
      rowName: "Пример1",
      id: "1",
      cards: [
        { name: "Фикс поиска", id: "1-1", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        { name: "Фикс поиска", id: "1-2", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
      ],
    },
    {
      rowName: "Пример2",
      id: "2",
      cards: [
        { name: "Фикс поиска", id: "2-1", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
        { name: "Фикс поиска", id: "2-2", author: "Ilya Bundelev", created: "2024-09-28T12:30:00Z", updated: "2024-09-28T12:30:00Z" },
      ],
    },
  ]);
  useEffect (()=>{
    console.log(cards)
  },[cards])

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
                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" />
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
                                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" />
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

export default KanbanPage;
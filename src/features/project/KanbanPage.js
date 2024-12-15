import React, { useState, useEffect } from "react";
import MenuDotsIco from "images/menudots";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import PlusIco from "images/plus";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import "css/kanbanpage.css";
import Loading from "features/shared/components/Loading";
import { useWebSocket } from "features/shared/contexts/WebSocketContext";
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useParams } from "react-router-dom";

function formatDate(milliseconds) {
    const getWordEnding = (number, one, two, five) => {
        number = Math.abs(number) % 100;
        const n1 = number % 10;
        if (number > 10 && number < 20) {
          return five;
        }
        if (n1 > 1 && n1 < 5) {
          return two;
        }
        if (n1 === 1) {
          return one;
        }
        return five;
    };
    const now = new Date();
    const diff = now - new Date(milliseconds);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (seconds < 60) {
      return "только что";
    } else if (minutes < 60) {
      return `${minutes} минут${getWordEnding(minutes, 'у', 'ы', '')} назад`;
    } else if (hours < 24) {
      return `${hours} час${getWordEnding(hours, '', 'а', 'ов')} назад`;
    } else if (days < 7) {
      return `${days} д${getWordEnding(days, 'ень', 'ня', 'ней')} назад`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} недел${getWordEnding(weeks, 'ю', 'и', 'ь')} назад`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} месяц${getWordEnding(months, '', 'а', 'ев')} назад`;
    } else {
      const years = Math.floor(days / 365);
      return `${years} ${getWordEnding(years, 'год', 'года', 'лет')} назад`;
    }
}

const KanbanPage = () => {
  const {isNightTheme } = useTheme();
  const {sendAction, iswsConnected, subscribeSocket, unsubscribeSocket} = useWebSocket()
  const [isDeleteWindowShown, setIsDeleteWindowShown] = useState(0)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [cardToEdit, setCardToEdit] = useState(null)
  const [cardToEditId, setCardToEditId] = useState(null)
  const [rowToEditId, setRowToEditId] = useState(null)
  const [newName, setNewName] = useState("")
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const { projectId } = useParams()
  const projectIdInt = parseInt(projectId)

  const [rowsCount,setRowsCount] = useState(cards.length)
  const [cardsCount,setCardsCount] = useState(cards.reduce((total, row) => total + row.kards.length, 0))
  
  const refactorKanbanData = (data) =>{
    const refactoredData = data.kanban.columns.map(column => ({
        ...column,
        frontId: `row${column.id}`,
        kards: column.kards.map(card => ({
          ...card,
          frontId: `card${card.id}`
        }))
      }))
    setCards(refactoredData)
  } 
  
  //sw logic
  useEffect(()=>{
    if (!navigator.serviceWorker.controller) return
    if (!iswsConnected) return

    subscribeSocket("Kanban", projectIdInt)
    sendAction("Kanban.GetKanban", {projectId: projectIdInt})
    console.log('Kanban ws subscribed');

    onmessage = (event) =>{
      const SWmessage = event.data;
      if (SWmessage.type === 'RECEIVE_MESSAGE') {
        const message = SWmessage.data
        if (message.projectId === projectIdInt && message.type === "entities.Action.Kanban.SetState") {
          refactorKanbanData(message);
          setIsLoading(false)
        }
      }
    }

    const unsubscribe = ()=>{
      unsubscribeSocket("Kanban", projectIdInt)
    }

    navigator.serviceWorker.addEventListener('message', onmessage)
  
    window.addEventListener('beforeunload', unsubscribe);

    return () => {
      unsubscribe()
      navigator.serviceWorker.removeEventListener("message", onmessage)
      window.removeEventListener('beforeunload', unsubscribe)
      console.log("Kanban ws unsubscribed");
    };
  // eslint-disable-next-line   
  },[iswsConnected])

  const handleAddColumnClick = () =>{
    setNewName("Новый столбец")
    setIsDeleteWindowShown(6)
  }

  const addColumn = () =>{
    setRowsCount(rowsCount + 1)

    sendAction("Kanban.CreateColumn",{
      name: newName,
      projectId: projectIdInt
    })

    setIsDeleteWindowShown(0)
  }

  const handleAddCardClick = (rowId) =>{
    setRowToEditId(rowId)
    setNewName("Новая карточка")
    setIsDeleteWindowShown(5)
  }

  const addCard = (rowId) =>{
    setCardsCount(cardsCount+1)    

    sendAction("Kanban.CreateKard",{
      projectId: projectIdInt,
      name: newName,
      desc: "Создано на огрызке сайта без описания",
      columnId: rowId
    })
    setIsDeleteWindowShown(0)
  }

  const deleteRow = (rowId) => {
    sendAction("Kanban.DeleteColumn", {
      projectId: projectIdInt,
      id: rowId
    })
    setIsDeleteWindowShown(0)
  };
  const handleDeleteRowClick = (rowId, rowIndex)=>{
    setRowToEditId(rowId)
    setRowToEdit(rowIndex)
    setIsDeleteWindowShown(1)
  }

  const deleteCard = (cardId) => {
    sendAction("Kanban.DeleteKard", {
      projectId: projectIdInt,
      id: cardId
    })
    setIsDeleteWindowShown(0)
  };
  const handleDeleteCardClick = (rowIndex, cardIndex, cardId)=>{
    setRowToEdit(rowIndex)
    setCardToEdit(cardIndex)
    setCardToEditId(cardId)
    setIsDeleteWindowShown(2)
  }
 
  const handleEditRowClick = (rowIndex, rowId) =>{
    setRowToEdit(rowIndex)
    setRowToEditId(rowId)
    setNewName(cards[rowIndex].name)
    setIsDeleteWindowShown(3)
  }
  const setRowName = (rowId, newName) => {
    sendAction("Kanban.UpdateColumn", {
      projectId: projectIdInt,
      id: rowId,
      name: newName
    })
    setIsDeleteWindowShown(0)
  }

  const handleEditCardClick = (rowIndex, cardIndex, cardId) =>{
    setCardToEdit(cardIndex)
    setCardToEditId(cardId)
    setNewName(cards[rowIndex].kards[cardIndex].title)
    setIsDeleteWindowShown(4)
  }

  const setCardName = (cardId, newName) =>{   
    sendAction("Kanban.UpdateKard", {
      projectId: projectIdInt,
      id: cardId,
      name: newName,
      desc: null
    })
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
      setCards(newColumnOrder)

      sendAction("Kanban.MoveColumn", {
        projectId: projectIdInt,
        id: cards[source.index].id,
        newPosition: destination.index
      })
      return;
    }

    // Перемещение карточек
    const startColumnIndex = source.droppableId;
    const finishColumnIndex = destination.droppableId;

    const startColumn = cards.find((col) => col.frontId === startColumnIndex);
    const finishColumn = cards.find((col) => col.frontId === finishColumnIndex);

    if (startColumn === finishColumn) {
      const newCardOrder = Array.from(startColumn.kards);
      const [movedCard] = newCardOrder.splice(source.index, 1);
      newCardOrder.splice(destination.index, 0, movedCard);

      const newColumn = {
        ...startColumn,
        kards: newCardOrder,
      };
      setCards((prevCards) =>
        prevCards.map((col) =>
          col.frontId === newColumn.frontId ? newColumn : col
        )
      );
      sendAction("Kanban.MoveKard", {
        projectId: projectIdInt,
        id: startColumn.kards[source.index].id,
        columnId: startColumn.id,
        newColumnId: finishColumn.id,
        newPosition: destination.index
      })
      return;
    }

    // Если карточка перемещается в другую колонку
    const startCardOrder = Array.from(startColumn.kards);
    const [movedCard] = startCardOrder.splice(source.index, 1);

    const finishCardOrder = Array.from(finishColumn.kards);
    finishCardOrder.splice(destination.index, 0, movedCard);

    const newStartColumn = {
      ...startColumn,
      kards: startCardOrder,
    };

    const newFinishColumn = {
      ...finishColumn,
      kards: finishCardOrder,
    };

    setCards((prevCards) =>
      prevCards.map((col) =>
        col.frontId === newStartColumn.frontId ? newStartColumn : col.frontId === newFinishColumn.frontId ? newFinishColumn : col
      )
    );
    
    sendAction("Kanban.MoveKard", {
      projectId: projectIdInt,
      id: startColumn.kards[source.index].id,
      columnId: startColumn.id,
      newColumnId: finishColumn.id,
      newPosition: destination.index
    })

  };

  if (!('serviceWorker' in navigator)) {
    return(
      <div className="no-chat-text page">В вашем браузере не поддерживается serviceWorker</div>
    )
  }
  if (iswsConnected === null || (isLoading && iswsConnected)) {
    return(
      <div className="kanban-page page"> 
        <Loading/>
      </div>
    )
  }
  if (!iswsConnected) {
    return(
      <div className="no-chat-text page">Ошибка подключения к серверу, перезагрузите страницу.</div>
    )
  }

  return (
    <div className="kanban-page page">
      <div className={`${isDeleteWindowShown !==0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
      {isDeleteWindowShown === 1 && (<DeleteModal onDelete={()=>deleteRow(rowToEditId)} text={cards[rowToEdit].kards.length === 0 ? `Вы уверены что хотите удалить пустой столбец ${cards[rowToEdit].name}?`: `Вы уверены что хотите удалить столбец ${cards[rowToEdit].name} с ${cards[rowToEdit].kards.length} карточками?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 2 && (<DeleteModal onDelete={()=>deleteCard(cardToEditId)} text={`Вы уверены что хотите удалить карточку ${cards[rowToEdit].kards[cardToEdit].title}?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 3 && (<EditModal onConfirm={()=>setRowName(rowToEditId, newName)} newValue={newName} setNewValue={setNewName} text={`Введите название колонки: `} isRowEdit={true} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 4 && (<EditModal onConfirm={()=>setCardName(cardToEditId, newName)} newValue={newName} setNewValue={setNewName} text={`Введите название карточки: `} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 5 && (<EditModal onConfirm={()=>addCard(rowToEditId)} newValue={newName} setNewValue={setNewName} text={`Введите название новой карточки: `} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 6 && (<EditModal onConfirm={()=>addColumn()} newValue={newName} setNewValue={setNewName} text={`Введите название новой колонки: `} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="kanban-main-container">
              {cards.map((row, i) => (
                <Draggable draggableId={row.frontId} index={i} key={row.frontId} isDragDisabled={isDragging}>
                  {(provided) => (
                    <div {...provided.draggableProps} ref={provided.innerRef} className="kanban-row">
                      <div className="kanban-row-top" {...provided.dragHandleProps}>
                        <p onClick={()=>{handleEditRowClick(i,row.id)}}>{row.name}</p>
                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" onDelete={()=>handleDeleteRowClick(row.id, i)} onEdit={()=>handleEditRowClick(i,row.id)}/>
                      </div>
                      <Droppable droppableId={row.frontId} type="card">
                        {(provided) => (
                          <div className="cards-container" ref={provided.innerRef} {...provided.droppableProps}>
                            {row.kards.map((card, j) => (
                              <Draggable draggableId={card.frontId} index={j} key={card.frontId} isDragDisabled={isDragging}>
                                {(provided) => (
                                  <div className="kanban-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <div className="card-top">
                                      <p className="card-name" onClick={()=>{handleEditCardClick(i,j,card.id)}}>{card.title}</p>
                                      <div className="more-butt" >
                                        <MenuDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" onDelete={()=>handleDeleteCardClick(i,j,card.id)} onEdit={()=>handleEditCardClick(i,j)}/>
                                      </div>
                                    </div>
                                    <p className="card-info">{`Автор: ${card.authorName}`}</p>
                                    <p className="card-info">{`Создано: ${formatDate(card.createdTimeMillis)}`}</p>
                                    <p className="card-info">{`Изменено: ${formatDate(card.updateTimeMillis)}`}</p>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <div className="kanban-row">
                              <div className="kanban-add-cont pointer" onClick={()=>handleAddCardClick(row.id)}>
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
                <div className="kanban-add-cont pointer" onClick={handleAddColumnClick}>
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
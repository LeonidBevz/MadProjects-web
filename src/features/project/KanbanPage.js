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
import { useNavigate, useParams } from "react-router-dom";
import useCSSVariable from "features/shared/hooks/useCssStyle";
import mixHexColors from "features/shared/components/ColorMIxer";
import ChatIco from "images/chatico";
import ChatAddIco from "images/chataddico";
import MenuRowDotsIco from "images/menurowdots";
import RecolorModal from "./components/Recolor";
import { useCreateChat } from "./hooks/useProject";
import CreateRowModal from "./components/CreateKanbanRow";

const KanbanPage = () => {
  const {isNightTheme, isSideBarPinned } = useTheme();
  const {sendAction, iswsConnected, subscribeSocket, unsubscribeSocket, checkSocket} = useWebSocket()
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
  const navigate = useNavigate()

  const [rowsCount,setRowsCount] = useState(cards.length)
  const [cardsCount,setCardsCount] = useState(cards.reduce((total, row) => total + row.kards.length, 0))
  
  const backgroundColor = useCSSVariable("--bg-color")

  const {mutate} = useCreateChat()

  const handleCreateChat = (cardId)=>{
    mutate({
      kardId: cardId,
      projectId: projectId
    }, {onSuccess: (data) =>{
      navigate(`/${projectId}/messenger`, {
        state: { chatId: data.chatId}
      }
      )
      
    }})
  }


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
  useEffect(()=>{
    checkSocket()
    // eslint-disable-next-line
  },[])
  //sw logic
  useEffect(()=>{
    if (!navigator.serviceWorker.controller) return
    if (!iswsConnected) return

    subscribeSocket("Kanban", projectIdInt)
    sendAction("Kanban.GetKanban", {projectId: projectIdInt})
    //console.log('Kanban ws subscribed');

    onmessage = (event) =>{
      const SWmessage = event.data;
      if (SWmessage.type === 'RECONNECTED'){
        setIsLoading(true)
        setCards([])
        setIsDeleteWindowShown(0)
        setNewName("")
        setRowToEdit(null)
        setCardToEdit(null)
        subscribeSocket("Kanban", projectIdInt)
        sendAction("Kanban.GetKanban", {projectId: projectIdInt})
    
        //console.log('Kanban ws subscribed reconnect');
        return
      }
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
      //console.log("Kanban ws unsubscribed");
    };
  // eslint-disable-next-line   
  },[iswsConnected])

  const handleAddColumnClick = () =>{
    setNewName("Новый столбец")
    setIsDeleteWindowShown(6)
  }

  const onCreateRow = (newName, color) =>{
    setRowsCount(rowsCount + 1)

    sendAction("Kanban.CreateColumn",{
      name: newName,
      color: color.slice(1),
      projectId: projectIdInt
    })

    setIsDeleteWindowShown(0)
  }

  const handleAddCardClick = (rowId) =>{
    setRowToEditId(rowId)
    setNewName("")
    setIsDeleteWindowShown(5)
  }

  const addCard = (rowId) =>{
    setCardsCount(cardsCount+1)    

    sendAction("Kanban.CreateKard",{
      projectId: projectIdInt,
      name: newName,
      desc: "",
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
  const handleRecolorRowClick = (rowId, rowIndex)=>{
    setRowToEditId(rowId)
    setRowToEdit(rowIndex)
    setIsDeleteWindowShown(7)
  }
  const onRecolor = (color) => {
    sendAction("Kanban.UpdateColumn", {
      projectId: projectIdInt,
      id: rowToEditId,
      name: null,
      color: color.slice(1)
    })
    setIsDeleteWindowShown(0)
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
      name: newName,
      color: null
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
    <div className={`kanban-page page ${isSideBarPinned ? "kanban-pinned":""}`}>
      <div className={`${isDeleteWindowShown !==0 ? "bg-blur-shown" :"bg-blur-hidden"} z15-level`}/>
      {isDeleteWindowShown === 1 && (<DeleteModal onDelete={()=>deleteRow(rowToEditId)} text={cards[rowToEdit].kards.length === 0 ? `Вы уверены что хотите удалить пустой столбец ${cards[rowToEdit].name}?`: `Вы уверены что хотите удалить столбец ${cards[rowToEdit].name} с ${cards[rowToEdit].kards.length} карточками?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 2 && (<DeleteModal onDelete={()=>deleteCard(cardToEditId)} text={`Вы уверены что хотите удалить карточку ${cards[rowToEdit].kards[cardToEdit].title}?`} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 3 && (<EditModal emptyText="Название столбца" onConfirm={()=>setRowName(rowToEditId, newName)} newValue={newName} setNewValue={setNewName} text={`Введите название колонки: `} isRowEdit={true} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 4 && (<EditModal emptyText="Название карточки"onConfirm={()=>setCardName(cardToEditId, newName)} newValue={newName} setNewValue={setNewName} text={`Введите название карточки: `} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 5 && (<EditModal emptyText="Название карточки" onConfirm={()=>addCard(rowToEditId)} newValue={newName} setNewValue={setNewName} text={`Введите название новой карточки: `} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 6 && (<CreateRowModal onConfirm={onCreateRow} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      {isDeleteWindowShown === 7 && (<RecolorModal onConfirm={onRecolor} onCancel={()=>{setIsDeleteWindowShown(0)}}/>)}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="kanban-main-container">
              {cards.map((row, i) => (
                <Draggable draggableId={row.frontId} index={i} key={row.frontId} isDragDisabled={isDragging}>
                  {(provided) => (
                    <div ref={provided.innerRef} className="kanban-row" {...provided.draggableProps} style={{borderTop: `7px solid #${row.color}` , backgroundColor: mixHexColors(backgroundColor, row.color), ...provided.draggableProps.style}} >
                      <div className="kanban-row-top" {...provided.dragHandleProps}> 
                        <p onClick={()=>{handleEditRowClick(i,row.id)}}>{row.name}</p>
                        <MenuRowDotsIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots" onDelete={()=>handleDeleteRowClick(row.id, i)} onRecolor={()=>handleRecolorRowClick(row.id, i)} onEdit={()=>handleEditRowClick(i,row.id)}/>
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
                                    <div className="card-bott" style={{display: "flex", cursor: "pointer"}} >
                                      {card.chatId && (<div onClick={()=> navigate(`/${projectId}/messenger`, {state: { chatId: card.chatId}})} style={{display: "flex", alignItems: "center"}}>
                                        <ChatIco className="chat-icon" color={isNightTheme ? "#d4d3cf" : "black"}/>
                                        {card.unreadMessage && <span>{card.unreadMessage}</span>}
                                      </div>
                                      )}
                                      {!card.chatId && (<div onClick={()=>handleCreateChat(card.id)} style={{display: "flex", alignItems: "center"}}>
                                        <ChatAddIco className="chat-icon" color={isNightTheme ? "#d4d3cf" : "black"}/>
                                        <span style={{fontSize: "0.8rem"}}>Создать чат</span>
                                      </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                              <div className="kanban-add-cont pointer" onClick={()=>handleAddCardClick(row.id)}>
                                <p className="kanban-add-text">Добавить карточку</p>
                                <PlusIco color={isNightTheme ? "#d4d3cf" : "black"} className="dots"/>
                              </div>
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
      <div className="add-column" onClick={handleAddColumnClick}>
        <PlusIco color={"white"} className="plus-column"/>
      </div>
    </div>
  );
};

export default KanbanPage;
import React, {useState, useEffect} from "react";
import "./messenger.css"
import ChatsList from "../components/chatslist";
import ChatWindow from "../components/chatwindow";


const MessengerPage = () => {
    const [activeChat, setActiveChat] = useState(null);
    const [isChatListVisible, setChatListVisible] = useState(true);
    const chatsList = [
        {id: 1, title: "Закладки", lastMessage: {id: 1, text: "В след. раз убить!", senderId: 1, time: "1989-08-29T10:00:00Z"}, unreadMessagesCount: 10},
        {id: 1, title: "Общий чат", lastMessage: {id: 1, text: "Где коммиты?", senderId: 1, time: "2024-08-29T10:00:00Z"}, unreadMessagesCount: 3},
        {id: 1, title: "Закладки", lastMessage: {id: 1, text: "Где коммиты?", senderId: 1, time: "2024-09-29T10:00:00Z"}, unreadMessagesCount: 0},
        {id: 1, title: "Закладки", lastMessage: {id: 1, text: "Где коммиты?", senderId: 1, time: "2024-10-14T10:00:00Z"}, unreadMessagesCount: 33},
        {id: 1, title: "Закладки", lastMessage: {id: 1, text: "Где коммиты?", senderId: 1, time: "2024-08-29T10:00:00Z"}, unreadMessagesCount: 1}    
    ]
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
    const [isSuperWide, setIsSuperWide] = useState(window.innerWidth < 1900);

    const handleBackClick = () =>{
        setActiveChat(null)
        setChatListVisible(true)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
      setIsSuperWide(window.innerWidth > 1900)
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(()=>{
        if (isMobile && activeChat) {
            setChatListVisible(false)
        } 
        else{
            setChatListVisible(true)
        }
    },[isMobile])

    const handleChatSelect = (chat) => {
        setActiveChat(chat);
        if (isMobile) {
            setChatListVisible(false)
        }
    };

    return (
      <div className="messenger-page"> 
        {isChatListVisible && ( <ChatsList chats={chatsList} onChatSelect={handleChatSelect}/>)}
        {activeChat ? <ChatWindow chat={activeChat} isMobile={isMobile} isSuperWide={isSuperWide} onBackClick={handleBackClick}/> : !isMobile ? <div>Выберите чат</div>:<></>}
      </div>
    );
  }
  
  export default MessengerPage;
import React, {useState, useEffect, useRef} from "react";
import "./messenger.css"
import ChatsList from "../components/chatslist";
import ChatWindow from "../components/chatwindow";
import {MessengerSocket} from "../urls"


const MessengerPage = () => {
    const ws = useRef(null);
    const [activeChat, setActiveChat] = useState(null);
    const [isChatListVisible, setChatListVisible] = useState(true);
    const [chatsList,setChatList] = useState([])
    const [messages, setMessages] = useState({readMessages: [], unreadMessages: []});
    const messagesRef = useRef(messages)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
    const [isSuperWide, setIsSuperWide] = useState(window.innerWidth > 1900);

    const sendAction = (actionType, params) => {
      const action = { type: "entities.ClientAction." + actionType, ...params };
      ws.current.send(JSON.stringify(action));
    };
    
    const sendMessage = (newMessage) =>{
      if (newMessage.trim() === '') return;
      sendAction("SendMessage",{
        chatId: activeChat.id, 
        message: newMessage
      })
    }
    const handleBackClick = () =>{
        setActiveChat(null)
        setChatListVisible(true)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
      setIsSuperWide(window.innerWidth > 1900)
    };

    useEffect(()=>{
      if (!activeChat) return;
      sendAction("RequestChatMessages",{
        chatId: activeChat.id
      })
    },[activeChat])

    useEffect(() => {
      window.addEventListener('resize', handleResize);
      
      ws.current = new WebSocket(MessengerSocket);

      ws.current.onopen = () => {
        sendAction('Authorize', {
          jwt: '3',
          projectId: 1,
        });
        sendAction("RequestChatsList",{
          projectId: 1
        })
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type ==="entities.ServerAction.SendChatsList"){
          setChatList(message.chats)
        }
        else if (message.type ==="entities.ServerAction.SendChatMessages"){
          setMessages(message)
        }
        else if(message.type === "entities.ServerAction.NewMessage") {
          console.log(message.chatId,messages.chatId)
          if (messagesRef && message.chatId===messagesRef.current.chatId){
            console.log(message)
            setMessages((prevState) => ({
              ...prevState,
              unreadMessages: [...prevState.unreadMessages, message.message] 
            }));
          }
        }
        console.log(message)
      };

      ws.current.onclose = () => {
          console.log('WebSocket disconnected');
      };
  
      return () => {
        window.removeEventListener('resize', handleResize);
        if (ws.current) {
          ws.current.close();
      }
      };
    }, []);

    useEffect(()=>{
        if (isMobile && activeChat) {
            setChatListVisible(false)
        } 
        else{
            setChatListVisible(true)
        }
        // eslint-disable-next-line
    },[isMobile])
    
    useEffect(()=>{
      messagesRef.current = messages
      // eslint-disable-next-line
    },[messages])

    const handleChatSelect = (chat) => {
        setActiveChat(chat);
        if (isMobile) {
            setChatListVisible(false)
        }
    };

    const readMessagesUntil = (messageId) => {
      const messageIndex =  messages.unreadMessages.findIndex(message => message.id === messageId);
      
      if (messageIndex === -1) {
          console.error(`Сообщение с ID ${messageId} не найдено в непрочитанных.`);
          return;
      }
      
      const messagesToMove = messages.unreadMessages.slice(0, messageIndex + 1);
      
      setMessages((prevState) => ({
        ...prevState,
        unreadMessages: messages.unreadMessages.slice(messageIndex + 1),
        readMessages: [...prevState.readMessages, ...messagesToMove]
    }));
      // Отправка действия, если необходимо
    };

    return (
      <div className="messenger-page"> 
        {isChatListVisible && ( <ChatsList chats={chatsList} onChatSelect={handleChatSelect}/>)}
        {activeChat ? <ChatWindow chat={activeChat} messages={messages} onSendMessage={sendMessage} isMobile={isMobile} isSuperWide={isSuperWide} onBackClick={handleBackClick} readMessagesUntil={readMessagesUntil}/> : !isMobile ? <div>Выберите чат</div>:<></>}
      </div>
    );
  }
  
  export default MessengerPage;
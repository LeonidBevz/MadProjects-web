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
    const [messages, setMessages] = useState([]);
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
          jwt: '1',
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
          setMessages(message.messages)
        }
        else if(message.type === "entities.ServerAction.NewMessage") {
          setMessages(prevMessages => [...prevMessages,message.message]);
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

    const handleChatSelect = (chat) => {
        setActiveChat(chat);
        if (isMobile) {
            setChatListVisible(false)
        }
    };

    return (
      <div className="messenger-page"> 
        {isChatListVisible && ( <ChatsList chats={chatsList} onChatSelect={handleChatSelect}/>)}
        {activeChat ? <ChatWindow chat={activeChat} messages={messages} onSendMessage={sendMessage} isMobile={isMobile} isSuperWide={isSuperWide} onBackClick={handleBackClick}/> : !isMobile ? <div>Выберите чат</div>:<></>}
      </div>
    );
  }
  
  export default MessengerPage;
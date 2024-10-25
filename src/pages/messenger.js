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
    const chatsListRef = useRef(chatsList)
    const [initialMessages, setInitialMessages] = useState([])
    const [groupedMessages, setGroupedMessages] = useState([])
    const groupedMessagesRef = useRef(groupedMessages)
    const activeChatRef = useRef(activeChat)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
    const [isSuperWide, setIsSuperWide] = useState(window.innerWidth > 1900);
    const chatContainer = useRef(null)

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
          setInitialMessages(prevChatMessages => [...prevChatMessages, message]);
        }
        else if(message.type === "entities.ServerAction.NewMessage") {
          if (activeChatRef.current && message.chatId===activeChatRef.current.id){
            addToGroupedMessages(message)
          }
          addLastMessage(message)          
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
      groupedMessagesRef.current = groupedMessages 
      console.log(groupedMessages,"new grouped messages")
      // eslint-disable-next-line
    },[groupedMessages])

    useEffect(()=>{
      chatsListRef.current = chatsList 
      // eslint-disable-next-line
    },[chatsList])

    useEffect(()=>{
      activeChatRef.current = activeChat
      // eslint-disable-next-line
    },[activeChat])

    useEffect(() => {
      const groupMessages = (messages) => {
          const groupedMessages = [];
          const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
          const fiveMinutes = 5 * 60 * 1000; // 5 минут в миллисекундах
  
          let previousDate = '';
          let lastMessageGroup = null;
  
          messages.forEach((message) => {
              const messageDate = new Date(message.time);
              const messageDateString = messageDate.toLocaleDateString(undefined, dateFormatOptions);
  
              if (messageDateString !== previousDate) {
                  previousDate = messageDateString;
  
                  lastMessageGroup = {
                      date: messageDateString,
                      messages: []
                  };
                  groupedMessages.push(lastMessageGroup);
              }
  
              const lastMessage = lastMessageGroup.messages[lastMessageGroup.messages.length - 1];
              if (lastMessage && message.senderId === lastMessage.senderId && (messageDate - new Date(lastMessage.messages[0].time)) <= fiveMinutes) {
                  lastMessage.messages.push(message);
              } else {
                  lastMessageGroup.messages.push({
                      senderId: message.senderId,
                      messages: [message]
                  });
              }
          });
          return groupedMessages;
      };

      if (initialMessages.length===0){return}
      const start = performance.now();

      const grouped = {
          read: groupMessages(initialMessages.find(messages => messages.chatId === activeChat.id).readMessages),
          unread: groupMessages(initialMessages.find(messages => messages.chatId === activeChat.id).unreadMessages),
          chatId: activeChat.id
      }        

      const end = performance.now();  

      console.log(`Время группировки: ${end - start} миллисекунд`);
      
      setGroupedMessages(prevMessages => [...prevMessages, grouped])
      // eslint-disable-next-line
  },[initialMessages])

  const handleChatSelect = (chat) => {
      setActiveChat(chat);
      if (isMobile) {
          setChatListVisible(false)
      }
      if (!initialMessages.some(message => message.chatId === chat.id)){
        sendAction("RequestChatMessages",{
          chatId: chat.id
        })
      }
  };
  
  const addToGroupedMessages = (message) =>{
    const messageChat = groupedMessagesRef.current.find(messages => messages.chatId === message.chatId)
    //Добавление сообщения
    if (messageChat){    
      const messageDate = new Date(message.message.time);
      const messageDateString = messageDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    
      const newGroupedMessages = messageChat;
      
      let dateGroup = newGroupedMessages.unread.find(group => group.date === messageDateString);
      if (!dateGroup) {
          dateGroup = {
              date: messageDateString,
              messages: []
          };
          newGroupedMessages.unread.push(dateGroup);
      }

      if (!dateGroup.messages) {
        dateGroup.messages = []; 
      }

      const lastSenderGroup = dateGroup.messages[dateGroup.messages.length - 1];
      if (lastSenderGroup && lastSenderGroup.senderId === message.message.senderId) {
        lastSenderGroup.messages.push(message.message);
      } else {
        dateGroup.messages.push({
            senderId: message.message.senderId,
            messages: [message.message]
        });
      }
      groupedMessagesRef.current = groupedMessagesRef.current.map(chat => 
      chat.chatId === newGroupedMessages.chatId ? newGroupedMessages : chat
      );
      setGroupedMessages(groupedMessagesRef.current)
    }
  }

  const addLastMessage = (message) =>{
    //Обновление списка чатов
    const newChat = chatsListRef.current.find(chat => chat.id === message.chatId)
    if (newChat) {
        if (!activeChatRef.current || newChat.id !== activeChatRef.current.id) {
            newChat.unreadMessagesCount = (newChat.unreadMessagesCount || 0) + 1;
        }

        newChat.lastMessage = {
            id: message.message.id,
            text: message.message.text,
            senderId: message.message.senderId,
            time: message.message.time,
        };

        chatsListRef.current = chatsListRef.current.map(chat => 
          chat.id === newChat.id ? newChat : chat
        );
        
        setChatList(chatsListRef.current)        
    }
  }

  const onReadUntil = (messageId) =>{
    sendAction("ReadMessagesBefore",{
      messageId: messageId,
      chatId: activeChat.id
    })
  }

  return (
    <div className="messenger-page"> 
      {isChatListVisible && ( <ChatsList chats={chatsList} onChatSelect={handleChatSelect}/>)}
      {activeChat ? <ChatWindow 
        chat={activeChat} 
        groupedMessages={groupedMessages.find(message => message.chatId === activeChat.id) || { read: [], unread: [] }} 
        onSendMessage={sendMessage} 
        isMobile={isMobile} 
        isSuperWide={isSuperWide} 
        onBackClick={handleBackClick}
        onReadUntil={onReadUntil}
        containerRef={chatContainer}
      /> : !isMobile ? <div>Выберите чат</div>:<></>}
    </div>
  );
}
  
export default MessengerPage;
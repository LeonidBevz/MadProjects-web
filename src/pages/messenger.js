import React, {useState, useEffect, useRef} from "react";
import "./messenger.css"
import ChatsList from "../components/chatslist";
import ChatWindow from "../components/chatwindow";
import useToken from "../hooks/useToken";


const MessengerPage = () => {
    const {ws, sendAction, iswsConnected} = useToken();
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

    const sendMessage = (newMessage) =>{
      if (newMessage.trim() === '') return;
      sendAction("Messenger.SendMessage",{
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
      
    }, []);

    useEffect(()=>{
      if (ws.current && iswsConnected){
        sendAction('Messenger.Start');
        sendAction("Messenger.RequestChatsList",{
          projectId: 1
        })
        console.log('Messages ws subscribed');
      
        const currentWs = ws.current;

        currentWs.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type ==="entities.Action.Messenger.SendChatsList"){
            setChatList(message.chats)
          }
          else if (message.type ==="entities.Action.Messenger.SendChatMessages"){
            setInitialMessages(prevChatMessages => [...prevChatMessages, message]);
          }
          else if(message.type === "entities.Action.Messenger.NewMessage") {
            if (groupedMessagesRef.current && groupedMessagesRef.current.some(chat => chat.chatId === message.chatId)){
              addToGroupedMessages(message)
            }
            addLastMessage(message)          
          }
          else if(message.type ==="entities.Action.Messenger.UpdateChatUnreadCount"){
            updateUnreadCount(message.chatId, message.count)
          }
        };

        return () => {
          window.removeEventListener('resize', handleResize);
          if (currentWs) {
            sendAction('Messenger.Stop');
            console.log("Messages ws unsubscribed")
          }
        };
      };  

  
      
    },[iswsConnected])
    
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
      // eslint-disable-next-line
    },[groupedMessages])

    useEffect(()=>{
      chatsListRef.current = chatsList 
      // eslint-disable-next-line
    },[chatsList])

    useEffect(()=>{
      activeChatRef.current = activeChat
      scrollChatToNewMess()
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
      scrollChatToNewMess()
      
      // eslint-disable-next-line
  },[initialMessages])

  const scrollChatToNewMess = () =>{
    const container = chatContainer.current;
    if (!container){return}
    //плавная прокрутка до непрочитанных
    setTimeout(() => {
      const unreadSep = container.querySelector('.unread-sep');
      if (unreadSep) {    
          const topPosition = unreadSep.offsetTop;

            container.scrollTo({
              top: topPosition - 600,
              behavior: "smooth"  
            });
          
        }
      else{
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"   
          });
      }
    },1)
  }
  const handleChatSelect = (chat) => {
      setActiveChat(chat);
      if (isMobile) {
          setChatListVisible(false)
      }
      if (!initialMessages.some(message => message.chatId === chat.id)){
        sendAction("Messenger.RequestChatMessages",{
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

      const container = chatContainer.current;
     
      const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;

      if (isScrolledToBottom) {
        setTimeout(() => {
          container.scrollTo({
              top: container.scrollHeight,
            });
        }, 1);
      }
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

  const updateUnreadCount = (chatId, count) =>{
    let updatedChat = chatsListRef.current.find(chat => chat.id === chatId)

    updatedChat.unreadMessagesCount = count

    chatsListRef.current = chatsListRef.current.map(chat => 
      chat.id === chatId ? updatedChat : chat
    );
    
    setChatList(chatsListRef.current)  
  }
  
  const onReadUntil = (messageId) =>{
    sendAction("Messenger.ReadMessagesBefore",{
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
      /> : !isMobile ? <div className="no-chat-text">Выберите чат</div>:<></>}
    </div>
  );
}
  
export default MessengerPage;
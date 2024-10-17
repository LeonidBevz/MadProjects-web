import React,{useState, useRef, useEffect} from "react";
import LeftArrowIco from "../images/arrowleft";
import useToken from "../hooks/useToken";
import RightArrowIco from "../images/arrowrightico";

const ChatWindow = ({chat, isMobile, onBackClick, isSuperWide}) => {
    const {isNightTheme} = useToken()
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Привет, как дела?", senderId: "Бевз Леонид Александрович", time: "2024-10-15T10:05:00Z" },
        { id: 2, text: "Что нового?", senderId: "Гена Сусов", time: "2024-10-15T10:15:00Z" },
        { id: 3, text: "Как погода сегодня?", senderId: "Анна Иванова", time: "2024-10-15T10:30:00Z" },
        { id: 4, text: "Давай встретимся позже.", senderId: "Максим Петров", time: "2024-10-15T11:00:00Z" },
        { id: 5, text: "Не могу поверить, что это произошло!", senderId: "Елена Смирнова", time: "2024-10-15T11:30:00Z" },
        { id: 6, text: "Что ты думаешь по этому поводу?", senderId: "Бевз Леонид Александрович", time: "2024-10-15T12:00:00Z" },
        { id: 7, text: "Мне кажется, это отличная идея!", senderId: "Гена Сусов", time: "2024-10-15T12:15:00Z" },
        { id: 8, text: "Как ты это сделал?", senderId: "Анна Иванова", time: "2024-10-15T12:30:00Z" },
        { id: 9, text: "Согласен с тобой!", senderId: "Максим Петров", time: "2024-10-15T12:45:00Z" },
        { id: 10, text: "Я на самом деле не знаю, что сказать.", senderId: "Елена Смирнова", time: "2024-10-15T13:00:00Z" },
    
        { id: 11, text: "Привет, как дела?", senderId: "Бевз Леонид Александрович", time: "2024-10-16T10:05:00Z" },
        { id: 12, text: "Что нового?", senderId: "Гена Сусов", time: "2024-10-16T10:15:00Z" },
        { id: 13, text: "Как погода сегодня?", senderId: "Анна Иванова", time: "2024-10-16T10:30:00Z" },
        { id: 14, text: "Давай встретимся позже.", senderId: "Максим Петров", time: "2024-10-16T11:00:00Z" },
        { id: 15, text: "Не могу поверить, что это произошло!", senderId: "Елена Смирнова", time: "2024-10-16T11:30:00Z" },
        { id: 16, text: "Что ты думаешь по этому поводу?", senderId: "Бевз Леонид Александрович", time: "2024-10-16T12:00:00Z" },
        { id: 17, text: "Мне кажется, это отличная идея!", senderId: "Гена Сусов", time: "2024-10-16T12:15:00Z" },
        { id: 18, text: "Как ты это сделал?", senderId: "Анна Иванова", time: "2024-10-16T12:30:00Z" },
        { id: 19, text: "Согласен с тобой!", senderId: "Максим Петров", time: "2024-10-16T12:45:00Z" },
        { id: 20, text: "Я на самом деле не знаю, что сказать.", senderId: "Елена Смирнова", time: "2024-10-16T13:00:00Z" },
    
        { id: 21, text: "Привет, как дела?", senderId: "Бевз Леонид Александрович", time: "2024-10-17T10:05:00Z" },
        { id: 22, text: "Что нового?", senderId: "Гена Сусов", time: "2024-10-17T10:15:00Z" },
        { id: 23, text: "Как погода сегодня?", senderId: "Анна Иванова", time: "2024-10-17T10:30:00Z" },
        { id: 24, text: "Давай встретимся позже.", senderId: "Максим Петров", time: "2024-10-17T11:00:00Z" },
        { id: 25, text: "Не могу поверить, что это произошло!", senderId: "Елена Смирнова", time: "2024-10-17T11:30:00Z" },
        { id: 26, text: "Что ты думаешь по этому поводу?", senderId: "Бевз Леонид Александрович", time: "2024-10-17T12:00:00Z" },
        { id: 27, text: "Мне кажется, это отличная идея!", senderId: "Гена Сусов", time: "2024-10-17T12:15:00Z" },
        { id: 28, text: "Как ты это сделал?", senderId: "Анна Иванова", time: "2024-10-17T12:30:00Z" },
        { id: 29, text: "Согласен с тобой!", senderId: "Максим Петров", time: "2024-10-17T12:45:00Z" },
        { id: 30, text: "Я на самом деле не знаю, что сказать.", senderId: "Елена Смирнова", time: "2024-10-17T13:00:00Z" },
    ]);
    const [groupedMessages, setGroupedMessages] = useState([])
    const [userId, setUserId] = useState("Бевз Леонид Александрович")
    const textareaRef = useRef(null);

    useEffect(()=>{
        setMessage('')
    },[chat])

    useEffect(()=>{
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
            console.log(groupedMessages)
            return groupedMessages;
        };
        
        setGroupedMessages(groupMessages(messages));
    },[messages])

    const handleInputChange = (event) => {
        const textarea = textareaRef.current;
        
        textarea.style.height = 'auto';
    
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    
        setMessage(event.target.value);
    };

    return (
        <div className="chat-window">
            <div className="chat-top">
                {isMobile && (<LeftArrowIco className="back-arr" color={isNightTheme ? "#d4d3cf" : "black"} onClick={onBackClick}/>)}
                <h1>{chat.title}</h1>
            </div>
            <div className="chat-center">
            {groupedMessages.map((messagesADay,k)=>(<div key={k}>
                <p className="date-sep">{messagesADay.date}</p>
                {messagesADay.messages.map((messageGroup,i)=>(
                    <div className={(messageGroup.senderId === userId && !isSuperWide)? "message-group-r" :"message-group-l"} key={i}>
                        {(messageGroup.senderId !== userId || isSuperWide) && (<div className="userpic-container">
                            <img className="user-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="pic"/>
                        </div>)}
                        <div className="messages-container">
                            <p className={`message-author ${(messageGroup.senderId === userId && !isSuperWide) ?"text-right":""}`}>{messageGroup.senderId}</p>
                            {messageGroup.messages.map((message,j)=>(<div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-container-r" : "message-container-l"} key={j}>
                                <div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-r bg-trans" : "message-l bg-trans"}>
                                    <span className="message-text cl-trans">{message.text}</span>
                                </div>
                                <span className="message-time cl-trans">{message.time ? message.time.slice(11, 16):""}</span>
                            </div>))}
                        </div>
                    </div>
                ))}
            </div>))}
            </div>
            <div className="chat-end bg-trans">     
                <textarea
                    ref={textareaRef}
                    className="chat-input cl-trans"
                    placeholder="Введите сообщение..."
                    value={message}
                    onChange={handleInputChange}
                    rows="1"
                 />
                 <RightArrowIco className="send-arr" color={isNightTheme ? "#d4d3cf" : "black"}/>
            </div>
        </div>   
      
    );
  }
  
  export default ChatWindow;
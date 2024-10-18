import React,{useState, useRef, useEffect} from "react";
import LeftArrowIco from "../images/arrowleft";
import useToken from "../hooks/useToken";
import RightArrowIco from "../images/arrowrightico";

const formatLinuxTime = (timestamp) =>{
    const date = new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
}

const ChatWindow = ({chat, isMobile, onBackClick, isSuperWide, messages, onSendMessage}) => {
    const {isNightTheme} = useToken()
    const [message, setMessage] = useState('');
   
    const [groupedMessages, setGroupedMessages] = useState([])
    const [userId, setUserId] = useState(2)
    const textareaRef = useRef(null);
    const containerRef = useRef(null)

    useEffect(()=>{
        setMessage('')

    },[chat])

    useEffect(()=>{//исправить обновление при каждом изменении
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

    useEffect(() => {
        const container = containerRef.current;
      
        const isScrolledToBottom =
          container.scrollHeight - container.scrollTop === container.clientHeight;
      
        if (isScrolledToBottom) {
          setTimeout(() => {
            container.scrollTo({
                top: container.scrollHeight,
              });
          }, 0);
        }
      }, [messages]);

    const checkTextAreaSize = () =>{
        const textarea = textareaRef.current;
        
        textarea.style.height = 'auto';
    
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
    const handleInputChange = (event) => {
        checkTextAreaSize()
        setMessage(event.target.value);
    };
    const handleSendClick = () =>{
        onSendMessage(message)
        setMessage("")
        setTimeout(checkTextAreaSize, 0); 
    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                e.preventDefault();
                setMessage((prev) => prev + "\n");
                setTimeout(checkTextAreaSize, 0);                
            } else {
                e.preventDefault();
                handleSendClick();
            }
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-top">
                {isMobile && (<LeftArrowIco className="back-arr" color={isNightTheme ? "#d4d3cf" : "black"} onClick={onBackClick}/>)}
                <h1>{chat.title}</h1>
            </div>
            <div className="chat-center" ref={containerRef}>
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
                                <span className="message-time cl-trans">{message.time ? formatLinuxTime(message.time):""}</span>
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
                    onKeyDown={handleKeyDown}
                 />
                 <RightArrowIco className="send-arr" color={isNightTheme ? "#d4d3cf" : "black"} onClick={()=>handleSendClick()}/>
            </div>
        </div>   
      
    );
  }
  
  export default ChatWindow;
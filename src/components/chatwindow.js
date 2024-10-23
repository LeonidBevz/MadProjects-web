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

const ChatWindow = ({chat, isMobile, onBackClick, isSuperWide, messages, onSendMessage, readMessagesUntil}) => {
    const {isNightTheme} = useToken()
    const [message, setMessage] = useState('');
    const [groupedMessages, setGroupedMessages] = useState({read:[],unread:[]})
    const [userId, setUserId] = useState(3)
    const [lastVisibleItem, setLastVisibleItem] = useState(null);
    const lastVisibleRef = useRef(null);
    const textareaRef = useRef(null);
    const containerRef = useRef(null);
    const readTimout = useRef(null)

    useEffect(()=>{
        setMessage('')

    },[chat])

    useEffect(() => {
      const container = containerRef.current;
     
      const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      if (!lastVisibleRef.current){//монтирование плавная прокрутка до непрочитанных
        const unreadSep = container.querySelector('.unread-sep');
    
        if (unreadSep) {
          const topPosition = unreadSep.offsetTop;
          container.scrollTo({
            top: topPosition - 600,
            behavior: 'smooth' // Плавная прокрутка
          });
        }
      }
      if (isScrolledToBottom && lastVisibleRef.current) {
        setTimeout(() => {
          container.scrollTo({
              top: container.scrollHeight,
            });
        }, 1);
      }
      
    }, [messages]);

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
        const grouped = {
            read: groupMessages(messages.readMessages),
            unread: groupMessages(messages.unreadMessages)
        }        
        console.log(grouped)
        setGroupedMessages(grouped)
    },[messages])

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = () => {
          findLastVisibleElement();
        };
        
        container.addEventListener('scroll', handleScroll);
    
        if (readTimout){
            clearTimeout(readTimout)
            console.log("read mess cancelled")
        }
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
    }, [messages.chatId]);
    
    useEffect(()=>{
        if (lastVisibleItem){
            lastVisibleRef.current = lastVisibleItem;
            console.log(lastVisibleRef.current.getAttribute("index"))

            if (readTimout.current) {
              clearTimeout(readTimout.current);
            };
                 
            readTimout.current = setTimeout(() => {
              console.log("sendReaded")
              readMessagesUntil(parseInt(lastVisibleItem.getAttribute("index")))
              setLastVisibleItem(null)
              readTimout.current = null;
            }, 5000);
        }
    },[lastVisibleItem])

    const findLastVisibleElement = () => {
        const container = containerRef.current;
        const elements = container.querySelectorAll('.unread'); 
    
        let lastVisible = null;
        const containerRect = container.getBoundingClientRect();
    
        elements.forEach((element) => {
          const elementRect = element.getBoundingClientRect();
  
          if (
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom
          ) {
            lastVisible = element;
          }
        });
       
        if (lastVisible && (lastVisibleRef.current===null || parseInt(lastVisibleRef.current.getAttribute("index")) < parseInt(lastVisible.getAttribute("index")))){
            setLastVisibleItem(lastVisible);
        }
       
    };   

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
            {groupedMessages.read.map((messagesADay,k)=>(<div key={k}>
                <p className="date-sep">{messagesADay.date}</p>
                {messagesADay.messages.map((messageGroup,i)=>(
                    <div className={(messageGroup.senderId === userId && !isSuperWide)? "message-group-r" :"message-group-l"} key={i}>
                        {(messageGroup.senderId !== userId || isSuperWide) && (<div className="userpic-container">
                            <img className="user-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="pic"/>
                        </div>)}
                        <div className="messages-container">
                            <p className={`message-author ${(messageGroup.senderId === userId && !isSuperWide) ?"text-right":""}`}>{messageGroup.senderId}</p>
                            {messageGroup.messages.map((message,j)=>(<div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-container-r" : "message-container-l"} key={j}>
                                <div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-r message" : "message-l message"} index={message.id}>
                                    <pre className="message-text">{message.text}</pre>
                                </div>
                                <span className="message-time">{message.time ? formatLinuxTime(message.time):""}</span>
                            </div>))}
                        </div>
                    </div>
                ))}
            </div>))}
            {groupedMessages.unread.length !== 0 && <div className="unread-sep">Непрочитанные сообщения</div>}
            {groupedMessages.unread.map((messagesADay,k)=>(<div key={k}>
                {messages.readMessages.length !==0 && messagesADay.date!==groupedMessages.read[groupedMessages.read.length-1].date && <p className="date-sep">{messagesADay.date}</p>}
                {messagesADay.messages.map((messageGroup,i)=>(
                    <div className={(messageGroup.senderId === userId && !isSuperWide)? "message-group-r" :"message-group-l"} key={i}>
                        {(messageGroup.senderId !== userId || isSuperWide) && (<div className="userpic-container">
                            <img className="user-pic" src="https://i.pinimg.com/736x/e0/88/aa/e088aa7320f0e3f6e4d6b3c3ce1f2811.jpg" alt="pic"/>
                        </div>)}
                        <div className="messages-container">
                            <p className={`message-author ${(messageGroup.senderId === userId && !isSuperWide) ?"text-right":""}`}>{messageGroup.senderId}</p>
                            {messageGroup.messages.map((message,j)=>(<div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-container-r" : "message-container-l"} key={j}>
                                <div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-r message unread" : "message-l message unread"} index={message.id}>
                                    <pre className="message-text">{message.text}</pre>
                                </div>
                                <span className="message-time">{message.time ? formatLinuxTime(message.time):""}</span>
                                <div className="unread-ico"></div>
                            </div>))}
                        </div>
                    </div>
                ))}
            </div>))}

            </div>
            <div className="chat-end">     
                <textarea
                    ref={textareaRef}
                    className="chat-input"
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
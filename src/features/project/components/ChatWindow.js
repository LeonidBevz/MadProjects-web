import React,{useState, useRef, useEffect} from "react";
import LeftArrowIco from "images/arrowleft";
import RightArrowIco from "images/arrowrightico";
import { useTheme } from "features/shared/contexts/ThemeContext";

const formatLinuxTime = (timestamp) =>{
    const date = new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
}

const ChatWindow = ({chat, isMobile, onBackClick, isSuperWide, groupedMessages, onSendMessage, onReadUntil, containerRef,sendersList, userId}) => {
    const {isNightTheme} = useTheme()
    const [message, setMessage] = useState('');
    const [lastVisibleItem, setLastVisibleItem] = useState(null);
    const lastVisibleRef = useRef(null);
    const textareaRef = useRef(null);
    const readTimout = useRef(null)

    useEffect(()=>{
        setMessage('')
        setLastVisibleItem(null)
        lastVisibleRef.current = null
        // eslint-disable-next-line
    },[chat])

    useEffect(() => {
        const container = containerRef.current;
        const handleScroll = () => {
          findLastVisibleElement();
        };

        findLastVisibleElement();
        
        container.addEventListener('scroll', handleScroll);
    
        if (readTimout){
            clearTimeout(readTimout)
        }
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line
    }, [groupedMessages.chatId]);
    
    useEffect(()=>{
        if (lastVisibleItem){
            lastVisibleRef.current = lastVisibleItem;

            if (readTimout.current) {
              clearTimeout(readTimout.current);
            };
            //уменьшить число непрочитанных
            readTimout.current = setTimeout(() => {
              //console.log("sendReaded", parseInt(lastVisibleItem.getAttribute("index")), chat.id)
              
              onReadUntil(parseInt(lastVisibleItem.getAttribute("index")))              
              readTimout.current = null;
            }, 5000);
        }
        // eslint-disable-next-line
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
            <header className="chat-top">
                {isMobile && (<LeftArrowIco className="back-arr" color={isNightTheme ? "#d4d3cf" : "black"} onClick={onBackClick}/>)}
                <h1>{chat.title}</h1>
            </header>
            <div className="chat-center" ref={containerRef}>
            {groupedMessages.read.map((messagesADay,k)=>(<div key={k}>
                <p className="date-sep">{messagesADay.date}</p>
                {messagesADay.messages.map((messageGroup,i)=>(
                    <div className={(messageGroup.senderId === userId && !isSuperWide)? "message-group-r" :"message-group-l"} key={i}>
                        {(messageGroup.senderId !== userId || isSuperWide) && (<div className="userpic-container">
                            <img className="user-pic" src={sendersList[messageGroup.senderId]?.avatar || "/baseProfilePic.png"} alt="pic" style={{cursor: "pointer"}} onClick={()=>window.open(`/profile/${messageGroup.senderId}`, '_blank')}/>
                        </div>)}
                        <div className="messages-container">
                            <p onClick={()=>window.open(`/profile/${messageGroup.senderId}`,"_blanc")} className={`message-author ${(messageGroup.senderId === userId && !isSuperWide) ?"text-right":""}`}>
                                {sendersList[messageGroup.senderId] ? sendersList[messageGroup.senderId].lastName + " "+sendersList[messageGroup.senderId].firstName + " "+sendersList[messageGroup.senderId].secondName : "Неизвестный хацкер"}
                            </p>
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
            {groupedMessages.unread.length !== 0 && <div className="unread-sep">Новые сообщения</div>}
            {groupedMessages.unread.map((messagesADay,k)=>(<div key={k}>
                {groupedMessages.read.length !==0 && messagesADay.date!==groupedMessages.read[groupedMessages.read.length-1].date && <p className="date-sep">{messagesADay.date}</p>}
                {messagesADay.messages.map((messageGroup,i)=>(
                    <div className={(messageGroup.senderId === userId && !isSuperWide)? "message-group-r" :"message-group-l"} key={i}>
                        {(messageGroup.senderId !== userId || isSuperWide) && (<div className="userpic-container">
                            <img className="user-pic" src={sendersList[messageGroup.senderId]?.avatar || "/baseProfilePic.png"} alt="pic"/>
                        </div>)}
                        <div className="messages-container">
                            <p className={`message-author ${(messageGroup.senderId === userId && !isSuperWide) ?"text-right":""}`}>{sendersList[messageGroup.senderId] ? sendersList[messageGroup.senderId].lastName + " "+sendersList[messageGroup.senderId].firstName + " "+sendersList[messageGroup.senderId].secondName : "Неизвестный хацкер"}</p>
                            {messageGroup.messages.map((message,j)=>(<div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-container-r" : "message-container-l"} key={j}>
                                <div className={(messageGroup.senderId === userId && !isSuperWide) ? "message-r message unread" : "message-l message unread"} index={message.id}>
                                    <pre className="message-text">{message.text}</pre>
                                </div>
                                <span className="message-time">{message.time ? formatLinuxTime(message.time):""}</span>
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
                    maxLength={256}
                 />
                 <RightArrowIco className="send-arr" color={isNightTheme ? "#d4d3cf" : "black"} onClick={()=>handleSendClick()}/>
            </div>
        </div>   
      
    );
  }
  
  export default ChatWindow;
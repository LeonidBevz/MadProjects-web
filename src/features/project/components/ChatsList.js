import React  from "react";
import BookmarksIco from "images/bookmarks";
import MembersPrivateIco from "images/memprivate";
import KardIco from "images/kard";
import { useTheme } from "features/shared/contexts/ThemeContext";

function getTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000); // разница в секундах
  
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    if (minutes < 1){
      return `т. ч.`;
    }
    if (minutes < 60) {
      return `${minutes} м.`;
    }
    if (hours < 24) {
      return `${hours} ч.`;
    }
    if (days < 7) {
      return `${days} д.`;
    }
    if (days < 30) {
      return `${Math.floor(days / 7)} н.`;
    }
    if (days < 365) {
      return `${Math.floor(days / 30)} м.`;
    }
    
    if (years % 10 < 5 && years % 10 !== 0) {
      return `${years} г.`;
    }
    
    return `${years} л.`; 
}

  
const ChatsList = ({chats, onChatSelect, activeChat, sendersList}) => {
    const {isNightTheme} = useTheme()
  
    return (     
        <div className="chats-list" id="chat-list">
            {chats.map((chat,index)=>( <div className={`chat-list-tile ${activeChat && activeChat.id === chat.id ? "active-chat-list-tile" :""}`} key={index} onClick={()=>onChatSelect(chat)}>
              {chat.chatType === "Public" && <BookmarksIco color={isNightTheme ? "#d4d3cf" : "black"} className="chatIco"/>}
              {chat.chatType === "MembersPrivate" && <MembersPrivateIco color={isNightTheme ? "#d4d3cf" : "black"} className="chatIco"/>}
              {chat.chatType === "CuratorPrivate" && <MembersPrivateIco color={isNightTheme ? "#d4d3cf" : "black"} className="chatIco"/>}
              {chat.chatType === "Kard" && <KardIco color={isNightTheme ? "#d4d3cf" : "black"} className="chatIco"/>}
              <div className="chat-list-tile-content"> 
                  <h2>{chat.title}</h2>
                  {chat.lastMessage !== null && (<div className="chat-list-tile-lastmess"> 
                      <span className="chat-list-tile-lastmess-combined no-trans">
                        <span className="chat-list-tile-lastmess-user">{ sendersList[chat.lastMessage.senderId] ? sendersList[chat.lastMessage.senderId].lastName + " " + sendersList[chat.lastMessage.senderId].firstName.slice(0,1) + "." + sendersList[chat.lastMessage.senderId].secondName.slice(0,1) + "." : "Неизвестный"}</span>
                        <span className="chat-list-tile-lastmess-mess">{chat.lastMessage.text}</span>
                      </span>
                      <p className="chat-list-tile-lastmess-date">{getTimeAgo(chat.lastMessage.time)}</p>
                  </div>)}
              </div>
              {chat.unreadMessagesCount > 0 &&(<div className="chat-list-tile-new">
                  {chat.unreadMessagesCount > 99 ? 99 : chat.unreadMessagesCount}
              </div>)}
            </div>))}
        </div>
        
    );
  }
  
  export default ChatsList;
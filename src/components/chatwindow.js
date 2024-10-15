import React from "react";

const ChatWindow = ({chat}) => {
  
    return (
        <div className="chat-window">
            <div id="chatContent">{chat.title}</div>
        </div>   
      
    );
  }
  
  export default ChatWindow;
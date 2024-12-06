const url = new URL(window.location.href);
console.log("Current path:",  url);  
const BackURL = "https://kaelesty.ru:5000"
const MessengerSocket = "wss://kaelesty.ru:8080/project"
const GitBackUrl ="https://kaelesty.ru:8080"

export {BackURL, MessengerSocket, GitBackUrl}

const url = new URL(window.location.href);
console.log("Current path:",  url);  
const BackURL = url.origin
const MessengerSocket = "wss://kaelesty.ru:8080/project"

export {BackURL, MessengerSocket}

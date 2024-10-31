const url = new URL(window.location.href);
console.log("Current path:",  url);  
const BackURL = url.origin//"https://8333-185-61-252-13.ngrok-free.app"
const MessengerSocket = "wss://kaelesty.ru:8080/project"

export {BackURL, MessengerSocket}

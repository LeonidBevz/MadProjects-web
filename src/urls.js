const url = new URL(window.location.href);
console.log("Current path:",  url);  
const BackURL = url.origin//"https://8333-185-61-252-13.ngrok-free.app"
const MessengerSocket = "ws://89.111.155.129:8080/project"

export {BackURL, MessengerSocket}

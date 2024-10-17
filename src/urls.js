const url = new URL(window.location.href);
console.log("Current path:",  url);  
const BackURL = url.origin//"https://8333-185-61-252-13.ngrok-free.app"
const MessengerSocket = "ws:/a99f-193-32-202-60.ngrok-free.app/messenger"

export {BackURL, MessengerSocket}

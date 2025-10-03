const url = new URL(window.location.href);

let MessengerSocket;
let BackURL;


if (url.hostname === "localhost") {
    const hostname =  "mad-projects.ru"

    MessengerSocket = "wss://"+ hostname+":8080/project";
    BackURL = "https://"+ hostname+":8080";
} else {
    MessengerSocket = "wss://" + url.hostname + ":8080/project";
    BackURL = url.origin + ":8080";
}

export {BackURL, MessengerSocket}

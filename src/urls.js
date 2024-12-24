const url = new URL(window.location.href);

let MessengerSocket;
let BackURL;
let AnaliticsURL;


if (url.hostname === "localhost") {
    const hostname =  "kaelesty.ru"

    MessengerSocket = "wss://"+ hostname+":8080/project";
    BackURL = "https://"+ hostname+":8080";
    AnaliticsURL = "https://"+ hostname+":5002";
} else {
    MessengerSocket = "wss://" + url.hostname + ":8080/project";
    BackURL = url.origin + ":8080";
    AnaliticsURL = url.origin + ":5002";
}

export {BackURL, MessengerSocket, AnaliticsURL}

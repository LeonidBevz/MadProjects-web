let socket = null;
let authorized = false
let socketURL = null

function sendMessageToAllClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  })
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован...');
  event.waitUntil(
    self.clients.claim().then(() => {
      sendMessageToAllClients({ type: 'SW_registered' })
    })
  );
});

self.addEventListener('destroy', () => {
  if (socket) {
    socket.close();
  }
});


self.addEventListener('message', (event) => {
  const message = event.data;
  console.log("Client message ", message)

  if (message.type === 'claim_clients') {
    self.clients.claim().then(() => {
      sendMessageToAllClients({ type: 'SW_registered' })
    })
    return
  }
  if (message.type === 'start'){
    createWebSocket(message.url)
    return
  }
  if (message.type === "close"){
    if (socket) {
      socket.close();
      authorized=false
      return
    }
    authorized=false
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'socket_closed' });
      });
    });
    self.registration.unregister()
    return
  }  

  if (message.type === 'SEND_MESSAGE' && socket) {
    socket.send(message.data);
    
    return
  }
  if (message.type === 'AUTHORIZE' && socket && !authorized) {
    socket.send(message.data);
    authorized=true
    return
  }  
});

function createWebSocket(url){
  if (!socket) {
    socket = new WebSocket(url);
    socketURL = url
    
    socket.onopen = () => {
      console.log('WebSocket открыт');
      sendMessageToAllClients({ type: 'socket_opened' })
    }; 

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("Socket message: ", data)

        sendMessageToAllClients({ type: 'RECEIVE_MESSAGE', data: data })
      } catch (error) {
        console.error('Ошибка парсинга:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
      socket = null;
      authorized = false

      sendMessageToAllClients({ type: 'socket_closed' })
      self.registration.unregister()
    };

    socket.onclose = () => {
      console.log('WebSocket закрыт');
      socket = null;
      authorized = false

      sendMessageToAllClients({ type: 'socket_closed' })

      self.registration.unregister()
    };
  }
  else{
    sendMessageToAllClients({ type: 'socket_already_opened' })
    console.log("Socket already started ", socket) 
  }
}


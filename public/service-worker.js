let socket = null;
let authorized = false
let socketURL = null

const subscriptions = {};

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
    subscriptions={}
    sendMessageToAllClients({ type: 'socket_closed' })
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

  if (message.type === 'SUBSCRIBE' && socket){
    const { channel, projectId, clientId } = message.data;
    if (!subscriptions[channel]){
      subscriptions[channel] = {};
    }

    if (!subscriptions[channel][projectId]) {
      subscriptions[channel][projectId] = { count: 0, clients: new Set() };
    }

    const project = subscriptions[channel][projectId];

    if (!project.clients.has(clientId)) {
      project.clients.add(clientId);
      project.count++;
      
      if (project.count === 1) {
        socket.send(JSON.stringify({type: `entities.Intent.${channel}.Start`, projectId: projectId}))
      }
    } 
    return
  }

  if (message.type === 'UNSUBSCRIBE' && socket){
     
    const { channel, projectId, clientId } = message.data;
    const project = subscriptions[channel][projectId];
    if (project && project.clients.has(clientId)) {
      project.clients.delete(clientId);
      project.count--;  
     
      if (project.count === 0) {
        socket.send(JSON.stringify({type: `entities.Intent.${channel}.Stop`, projectId: projectId}))
      }
    }
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
      subscriptions={}
      sendMessageToAllClients({ type: 'socket_closed' })
      self.registration.unregister()
    };

    socket.onclose = () => {
      console.log('WebSocket закрыт');
      socket = null;
      authorized = false
      subscriptions={}
      sendMessageToAllClients({ type: 'socket_closed' })
      self.registration.unregister()
    };
  }
  else{
    sendMessageToAllClients({ type: 'socket_already_opened' })
    console.log("Socket already started ", socket) 
  }
}


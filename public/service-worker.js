let socket = null;
let authorized = false

self.addEventListener('install', () => {
  self.skipWaiting(); 
});

self.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === 'SKIP_WAITING') {
    self.skipWaiting(); 
  }
  if (message.type === 'start'){
    if (!socket) {
      socket = new WebSocket(message.url);
      
      socket.onopen = () => {
        console.log('WebSocket открыт');

        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'socket_opened' });
          });
        });
      };
  
      socket.onmessage = (event) => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'RECEIVE_MESSAGE', data: event.data });
          });
        });
      };
  
      socket.onerror = (error) => {
        console.error('WebSocket ошибка:', error);
      };
  
      socket.onclose = () => {
        console.log('WebSocket закрыт');
        socket = null;

        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'socket_closed' });
          });
        });
      };
    }
    else{
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'socket_already_opened' });
        });
      });
      console.log("Socket already started ", socket) 
    }
  }
  if (message.type === 'SEND_MESSAGE' && socket) {
    socket.send(message.data);
    console.log("Send message ",message.data)
  }
  if (message.type === 'AUTHORIZE' && socket && !authorized) {
    socket.send(message.data);
    authorized=true
  }
  if (message.type === "close"){
    if (socket) {
      socket.close();
      authorized=false
    }
  }
  
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim()
  );
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'SW_registered' });
    });
  });

});

self.addEventListener('destroy', () => {
  if (socket) {
    socket.close();
  }
});
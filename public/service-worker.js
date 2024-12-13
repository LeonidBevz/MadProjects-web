let socket = null;
let authorized = false
let socketURL = null

self.addEventListener('install', (event) => {
  console.log('Service Worker устанавливается...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован...');
  event.waitUntil(self.clients.claim());
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


self.addEventListener('message', (event) => {
  const message = event.data;
  
  if (message.type === 'SKIP_WAITING') {
    self.skipWaiting(); 
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
    console.log("Send message ", message.data)
    return
  }
  if (message.type === 'AUTHORIZE' && socket && !authorized) {
    socket.send(message.data);
    authorized=true
    return
  }  
  if (message.type === 'UNAUTHORIZE'){
    authorized=false

    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'socket_opened' });
      });
    });
    return
  }
});

function createWebSocket(url){
  if (!socket) {
    socket = new WebSocket(url);
    socketURL = url
    
    socket.onopen = () => {
      console.log('WebSocket открыт');

      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'socket_opened' });
        });
      });
    }; 

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'RECEIVE_MESSAGE', data: data });          
            
          });
        });
      } catch (error) {
        console.error('Ошибка парсинга:', error);
      }
      
    };

    socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
      socket = null;
      authorized = false

      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'socket_closed' });
        });
      });
      self.registration.unregister()
    };

    socket.onclose = () => {
      console.log('WebSocket закрыт');
      socket = null;
      authorized = false

      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'socket_closed' });
        });
      });
      self.registration.unregister()
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


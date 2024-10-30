import WebSocket from 'ws';
import url from 'url';

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = new url.URL(request.url, `http://${request.headers.host}`).pathname;

    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('Received:', message);
    });

    const sendUpdate = (update) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(update));
      }
    };

    const interval = setInterval(() => {
      sendUpdate({ type: 'cityUpdate', data: { /* city data */ } });
    }, 5000);

    ws.on('close', () => clearInterval(interval));
  });

  return wss;
};

export default setupWebSocket;

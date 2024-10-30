import WebSocket from 'ws';

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection in User Service');

    ws.on('message', (message) => {
      console.log('Received in User Service:', message);
      // Handle incoming messages specific to User Service
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed in User Service');
    });
  });

  return wss;
};

export default setupWebSocket;

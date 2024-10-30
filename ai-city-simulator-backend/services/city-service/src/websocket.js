import WebSocket from 'ws';

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection in City Service');

    ws.on('message', (message) => {
      console.log('Received in City Service:', message);
      // Handle incoming messages specific to City Service
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed in City Service');
    });
  });

  return wss;
};

export default setupWebSocket;

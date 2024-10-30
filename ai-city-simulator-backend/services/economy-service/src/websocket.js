import WebSocket from 'ws';

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection in Economy Service');

    ws.on('message', (message) => {
      console.log('Received in Economy Service:', message);
      // Handle incoming messages specific to Economy Service
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed in Economy Service');
    });
  });

  return wss;
};

export default setupWebSocket;

import WebSocket from 'ws';

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection in AI Service');

    ws.on('message', (message) => {
      console.log('Received in AI Service:', message);
      // Handle incoming messages specific to AI Service
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed in AI Service');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
};

export default setupWebSocket;

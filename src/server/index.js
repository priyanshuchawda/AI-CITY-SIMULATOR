const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendUpdate = () => {
    const cityData = {
      population: Math.floor(Math.random() * 1000000),
      happiness: Math.floor(Math.random() * 100),
      funds: Math.floor(Math.random() * 1000000000),
      // Add more city data as needed
    };
    ws.send(JSON.stringify(cityData));
  };

  // Send updates every second
  const intervalId = setInterval(sendUpdate, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
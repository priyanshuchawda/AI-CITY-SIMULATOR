import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { Kafka } from 'kafkajs';
import cityService from './cityService';
import { connectToMongoDB } from './database/mongodb';
import { connectToPostgreSQL } from './database/postgresql';
import { connectToNeo4j } from './database/neo4j';
import authMiddleware from './security/authMiddleware';
import { encrypt, decrypt } from './security/encryption';
import apiLimiter from './security/rateLimiter';
import aiEthics from './features/aiEthics';
import fiveGSimulation from './features/5gSimulation';
import quantumComputing from './features/quantumComputing';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Kafka setup
const kafka = new Kafka({
  clientId: 'city-simulator',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'city-simulator-group' });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    try {
      await producer.send({
        topic: 'city-events',
        messages: [{ value: JSON.stringify(data) }],
      });
    } catch (error) {
      console.error('Failed to send message to Kafka:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Kafka consumer
const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'city-events', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.value.toString());
          }
        });
      },
    });
  } catch (error) {
    console.error('Kafka consumer error:', error);
  }
};

runConsumer();

// Database connections
let mongoDB, postgreSQL, neo4jSession;

const connectToDatabases = async () => {
  try {
    mongoDB = await connectToMongoDB();
    postgreSQL = await connectToPostgreSQL();
    neo4jSession = await connectToNeo4j();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

connectToDatabases();

// Apply middleware
app.use(express.json()); // JSON parser should be used before routes
app.use(apiLimiter); // Apply rate limiting to all requests

// Apply authentication middleware to protected routes
app.use('/api/protected', authMiddleware);

// Example of using encryption
app.post('/api/secure-data', (req, res) => {
  const { sensitiveData } = req.body;
  const encryptedData = encrypt(sensitiveData);
  // Store encryptedData in database
  res.json({ message: 'Data securely stored' });
});

// Example of using decryption
app.get('/api/secure-data/:id', authMiddleware, (req, res) => {
  // Fetch encryptedData from database using req.params.id
  const encryptedData = '...'; // Placeholder
  const decryptedData = decrypt(encryptedData);
  res.json({ data: decryptedData });
});

// AI Ethics endpoint
app.post('/api/ai-ethics/evaluate', (req, res) => {
  const { decision, context } = req.body;
  const evaluation = aiEthics.evaluateDecision(decision, context);
  res.json(evaluation);
});

// 5G Simulation endpoints
app.post('/api/5g/deploy', (req, res) => {
  const { area } = req.body;
  fiveGSimulation.deployInfrastructure(area);
  res.json(fiveGSimulation.getNetworkStatus());
});

app.get('/api/5g/status', (req, res) => {
  const { timeOfDay } = req.query;
  const status = fiveGSimulation.simulateNetworkLoad(parseInt(timeOfDay, 10));
  res.json(status);
});

// Quantum Computing endpoints
app.post('/api/quantum/upgrade', (req, res) => {
  const { qubits } = req.body;
  quantumComputing.upgradeQuantumComputer(qubits);
  res.json(quantumComputing.getQuantumComputerStatus());
});

app.post('/api/quantum/run-algorithm', (req, res) => {
  const { algorithm, problemSize } = req.body;
  try {
    const result = quantumComputing.runQuantumAlgorithm(algorithm, problemSize);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add routes
app.use('/api/city', cityService);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import aiRoutes from './routes/aiRoutes.js';
import quantumRoutes from './routes/quantumRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/db.js';
import setupWebSocket from './websocket.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/ai', aiRoutes);
app.use('/api/quantum', quantumRoutes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(errorHandler);

connectDB().then(() => {
  const server = http.createServer(app);
  setupWebSocket(server);

  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || 'path/to/server.key'),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || 'path/to/server.cert'),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    logger.info(`AI service running on https://localhost:${PORT}`);
    logger.info(`Swagger documentation available at https://localhost:${PORT}/api-docs`);
  });

  server.listen(PORT, () => {
    logger.info(`HTTP server running on port ${PORT}`);
  });
});

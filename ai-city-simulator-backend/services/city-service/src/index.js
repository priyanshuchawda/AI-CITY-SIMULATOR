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
import cityRoutes from './routes/cityRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/db.js';
import setupWebSocket from './websocket.js';
import networkRoutes from './routes/networkRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/city', cityRoutes);
app.use('/api/network', networkRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(errorHandler);

const server = http.createServer(app);

setupWebSocket(server);

const httpsOptions = {
  key: fs.readFileSync('../../ssl/server.key'),
  cert: fs.readFileSync('../../ssl/server.cert'),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  logger.info(`City service running on https://localhost:${PORT}`);
  logger.info(`Swagger documentation available at https://localhost:${PORT}/api-docs`);
});

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Service running on port ${PORT}`);
  });
}).catch((err) => {
  logger.error('Failed to connect to the database:', err);
  process.exit(1);
});

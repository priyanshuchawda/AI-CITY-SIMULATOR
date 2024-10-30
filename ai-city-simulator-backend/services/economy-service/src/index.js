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
import swaggerJsdoc from 'swagger-jsdoc';
import economyRoutes from './routes/economyRoutes';
import aiRoutes from './routes/aiRoutes';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/db';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(bodyParser.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Service API',
      version: '1.0.0',
      description: 'API documentation for the service',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/economy', economyRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(errorHandler);

const server = http.createServer(app);

const httpsOptions = {
  key: fs.readFileSync('../../ssl/server.key'),
  cert: fs.readFileSync('../../ssl/server.cert')
};

https.createServer(httpsOptions, server).listen(PORT, () => {
  logger.info(`Service running on https://localhost:${PORT}`);
  logger.info(`Swagger documentation available at https://localhost:${PORT}/api-docs`);
});

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Service running on port ${PORT}`);
  });
});

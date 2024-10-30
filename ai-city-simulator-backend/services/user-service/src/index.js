import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import userRoutes from './routes/userRoutes';
import aiRoutes from './routes/aiRoutes';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/db';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(errorHandler);

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Service running on port ${PORT}`);
    logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  logger.error('Database connection error:', err);
});

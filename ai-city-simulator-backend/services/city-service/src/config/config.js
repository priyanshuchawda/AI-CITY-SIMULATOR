import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI,
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',
};

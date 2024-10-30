import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3004,
  mongodbUri: process.env.MONGODB_URI,
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;

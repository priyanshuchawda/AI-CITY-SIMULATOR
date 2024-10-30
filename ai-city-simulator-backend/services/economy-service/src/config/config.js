import 'dotenv/config';

export default {
  port: process.env.PORT || 3003,
  mongodbUri: process.env.MONGODB_URI,
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',
};

import dotenv from 'dotenv';

// Load environment-specific .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  // Add other configuration variables
};

import redis from 'redis';

let client;

export const initRedis = async () => {
  let retries = 5;
  while (retries) {
    try {
      client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
      client.on('error', (error) => console.error(`Redis Error: ${error.message}`));
      await client.connect();
      console.log('Redis connected successfully');
      return client;
    } catch (error) {
      console.error(`Redis connection failed: ${error.message}`);
      retries -= 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Failed to connect to Redis after multiple attempts');
};

export const closeRedis = async () => {
  if (client) {
    await client.quit();
  }
};

export const getAsync = async (key) => {
  return await client.get(key);
};

export const setAsync = async (key, value, expiryMode, time) => {
  // Ensure expiryMode is either 'EX' (seconds) or 'PX' (milliseconds)
  const validExpiryModes = ['EX', 'PX'];
  if (!validExpiryModes.includes(expiryMode)) {
    throw new Error(`Invalid expiryMode: ${expiryMode}. Expected 'EX' or 'PX'.`);
  }
  
  return await client.set(key, value, {
    [expiryMode]: time
  });
};

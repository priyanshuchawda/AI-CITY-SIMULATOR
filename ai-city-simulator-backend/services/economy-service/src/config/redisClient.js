import redis from 'redis';

let client;

export const initRedis = async () => {
  try {
    client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
    client.on('error', (error) => console.error(`Redis Error: ${error.message}`));
    await client.connect();
    console.log('Redis connected successfully');
    return client;
  } catch (error) {
    console.error(`Redis connection failed: ${error.message}`);
    throw error;
  }
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
  return await client.set(key, value, { [expiryMode]: time });
};

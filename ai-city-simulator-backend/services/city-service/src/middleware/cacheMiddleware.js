import { getAsync, setAsync } from '../config/redisClient.js';

const cache = (duration) => {
  return async (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = await getAsync(key);

    if (cachedResponse) {
      res.send(JSON.parse(cachedResponse));
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      setAsync(key, JSON.stringify(body), 'EX', duration);
      res.sendResponse(body);
    };
    next();
  };
};

export default cache;

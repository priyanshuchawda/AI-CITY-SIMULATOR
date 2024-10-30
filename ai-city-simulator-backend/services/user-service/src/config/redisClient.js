/** @jest-environment node */
/* eslint-env jest */

// Import jest functions if you use jest.fn() for mocking
import { jest } from '@jest/globals';
import Redis from 'ioredis';

let client;

if (process.env.NODE_ENV === 'test') {
  // Mocking Redis client methods for testing purposes
  client = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
} else {
  // Actual Redis client initialization
  client = new Redis();
}

const getAsync = async (key) => {
  if (!client || typeof client.get !== 'function') {
    throw new Error('Redis client is not properly initialized.');
  }
  return await client.get(key);
};

const setAsync = async (key, value, expiryMode, time) => {
  if (!client || typeof client.set !== 'function') {
    throw new Error('Redis client is not properly initialized.');
  }
  return await client.set(key, value, expiryMode, time);
};

const delAsync = async (key) => {
  if (!client || typeof client.del !== 'function') {
    throw new Error('Redis client is not properly initialized.');
  }
  return await client.del(key);
};

export { getAsync, setAsync, delAsync };

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import * as db from '../db/db.js';
import * as redis from '../config/redisClient.js';
import { jest } from '@jest/globals';

jest.mock('../db/db.js', () => ({
  connectDB: jest.fn(),
  closeDB: jest.fn(),
}));

jest.mock('../config/redisClient.js', () => ({
  initRedis: jest.fn(),
  closeRedis: jest.fn(),
  getAsync: jest.fn(),
  setAsync: jest.fn(),
  delAsync: jest.fn(),
}));

describe('City Service Integration', () => {
  it('should create a new city', async () => {
    const cityData = {
      name: 'Test City',
      population: 100000,
      area: 50,
    };

    const response = await request(app)
      .post('/api/cities')
      .send(cityData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', cityData.name);
    expect(response.body).toHaveProperty('population', cityData.population);
    expect(response.body).toHaveProperty('area', cityData.area);
  });
});
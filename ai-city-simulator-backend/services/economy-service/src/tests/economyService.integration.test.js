import { jest, describe, test, expect, beforeAll, afterAll } from '@jest/globals'; // Import Jest functions
import request from 'supertest';
import app from '../app';
import { connectDB, closeDB } from '../db/db';
import { initRedis, closeRedis } from '../config/redisClient';
import * as economyService from '../services/economyService';
import axios from 'axios';

// Mock the axios module
jest.mock('axios');

// Increase global timeout to 60 seconds
jest.setTimeout(60000);

let mongoConnection;
let redisClient;

beforeAll(async () => {
  try {
    mongoConnection = await connectDB();
    redisClient = await initRedis();
  } catch (error) {
    console.error('Failed to set up test environment:', error);
    throw error;
  }
}, 60000); // Increase timeout to 60 seconds

afterAll(async () => {
  if (mongoConnection) await closeDB();
  if (redisClient) await closeRedis();
  // Add a longer delay to ensure all connections are fully closed
  await new Promise(resolve => setTimeout(resolve, 5000));
}, 30000);

describe('Service Integration', () => {
  test('should calculate economic indicators based on city data', async () => {
    const cityData = {
      population: 100000,
      employedPopulation: 60000,
      totalRevenue: 5000000000,
      totalExpenses: 4500000000,
    };

    const economicIndicators = await economyService.calculateEconomicIndicators(cityData);

    expect(economicIndicators).toHaveProperty('gdp');
    expect(economicIndicators).toHaveProperty('unemploymentRate');
    expect(economicIndicators).toHaveProperty('economicGrowthRate');
  }, 30000);

  test('should get economy stats', async () => {
    const response = await request(app)
      .get('/api/economy/stats');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('gdp');
    expect(response.body).toHaveProperty('unemploymentRate');
  }, 30000);

  // Add more integration tests here
});

// Mock axios response
axios.get.mockResolvedValue({
  data: {
    population: 100000,
    employedPopulation: 60000,
    totalRevenue: 5000000000,
    totalExpenses: 4500000000,
  }
});

import { jest, describe, it, expect } from '@jest/globals'; // Import Jest functions explicitly
import request from 'supertest';
import express from 'express';
import economyRoutes from './economyRoutes';

// Mock the economyService module
jest.mock('../services/economyService');
import * as economyService from '../services/economyService';

// Set up the Express app and routes
const app = express();
app.use(express.json());
app.use('/api/economy', economyRoutes);

describe('Economy Routes', () => {
  it('GET /api/economy/stats should return economy statistics', async () => {
    const mockStats = { gdp: 1000000, unemploymentRate: 5 };
    economyService.getEconomyStats.mockResolvedValue(mockStats);

    const response = await request(app).get('/api/economy/stats');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockStats);
  }, 60000); // Increase timeout to 60 seconds

  // Add more tests for other economy routes
});

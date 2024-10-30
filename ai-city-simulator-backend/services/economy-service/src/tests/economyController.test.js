// Import Jest functions explicitly if using TypeScript or specific setups
import { jest,describe, it, expect, beforeEach } from '@jest/globals'; // No need to import 'jest' if it's not used directly
import economyController from '../controllers/economyController';
import * as economyService from '../services/economyService';

// Mock the Redis client
jest.mock('../config/redisClient', () => ({
  getAsync: jest.fn(),
  setAsync: jest.fn(),
}));

describe('Economy Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get economy stats', async () => {
    const req = {};
    const res = { 
      json: jest.fn(), 
      status: jest.fn().mockReturnThis() 
    };

    // Mock the economyService.getEconomyStats function using jest.spyOn
    jest.spyOn(economyService, 'getEconomyStats').mockResolvedValue({
      gdp: 1000000,
      unemploymentRate: 5,
      inflationRate: 2
    });

    await economyController.getEconomyStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      gdp: expect.any(Number),
      unemploymentRate: expect.any(Number),
      inflationRate: expect.any(Number)
    }));
  });
});

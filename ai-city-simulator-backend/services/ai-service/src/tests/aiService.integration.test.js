import { jest, describe, it, expect } from '@jest/globals';
import * as aiService from '../services/aiService.js';

// Mock the entire quantumComputing module
jest.mock('../services/quantumComputing.js', () => ({
  performComplexCalculation: jest.fn().mockResolvedValue({ prediction: { result: 'success' } }),
}));

describe('AI Service Integration Tests', () => {
  it('should make a prediction', async () => {
    const req = {
      body: {
        cityId: 'testCity',
        cityData: {
          population: 1000000,
          infrastructure: 80,
          economy: 70,
        },
        economyData: {
          gdp: 50000,
          unemploymentRate: 5,
        },
        timeframe: 'short',
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await aiService.makePrediction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      prediction: expect.any(Object),
    }));
  });
});

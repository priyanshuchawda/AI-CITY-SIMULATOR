import { jest } from '@jest/globals';
import * as aiService from '../services/aiService.js';
import { makePrediction } from '../controllers/aiController.js';

jest.mock('../services/aiService.js');

describe('AI Controller', () => {
  it('should make a prediction', async () => {
    const req = {
      body: {
        cityData: {
          population: 1000000,
          infrastructure: 80,
          economy: 70,
        },
        economyData: {
          gdp: 50000,
          unemploymentRate: 5,
        },
        timeframe: 'short'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    aiService.makePrediction.mockResolvedValue({ prediction: 'Sample prediction' });

    await makePrediction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      prediction: expect.any(Object),
    }));
  });
});

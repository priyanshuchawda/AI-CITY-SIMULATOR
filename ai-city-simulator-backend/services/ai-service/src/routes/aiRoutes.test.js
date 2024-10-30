/* global jest, describe, it, expect */

import request from 'supertest';
import express from 'express';
import aiRoutes from './aiRoutes.js'; // Ensure this path is correct
import * as aiService from '../services/aiService.js'; // Ensure this path is correct
import * as aiEthicsService from '../services/aiEthicsService.js'; // Ensure this path is correct

// Mocking aiService and aiEthicsService modules
jest.mock('../services/aiService.js');
jest.mock('../services/aiEthicsService.js');

// Mocking MongoDB, Mongoose, and Axios
jest.mock('mongodb', () => ({
  MongoClient: {
    connect: jest.fn().mockResolvedValue({
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([]),
    }),
  },
}));

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  model: jest.fn(),
}));

jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  get: jest.fn(),
  post: jest.fn(),
}));

// Setting up Express app and routes
const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

// Mock the AI service
jest.mock('../services/aiService', () => ({
  makePrediction: jest.fn().mockResolvedValue({ result: 'mocked prediction' }),
}));

// Test suite for AI Routes
describe('AI Routes', () => {
  // Test case for the GET request to /api/ai
  it('should handle a GET request to /api/ai', async () => {
    const response = await request(app).get('/api/ai');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'AI Service is running' });
  });

  // Test case for the POST request to /api/ai/predict
  it('should handle a POST request to /api/ai/predict', async () => {
    const response = await request(app)
      .post('/api/ai/predict')
      .send({ cityId: 'testCity', timeframe: 'short' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('prediction');
    expect(response.body.prediction).toHaveProperty('result', 'mocked prediction');
  });
});

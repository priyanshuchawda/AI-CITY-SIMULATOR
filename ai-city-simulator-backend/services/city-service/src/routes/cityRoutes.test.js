import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cityRoutes from './cityRoutes.js';
import * as cityController from '../controllers/cityController.js';

jest.mock('../controllers/cityController.js');

const app = express();
app.use(express.json());
app.use('/api/cities', cityRoutes);

describe('City Routes', () => {
  it('POST /api/cities should create a new city', async () => {
    const mockCity = { name: 'New City', population: 1000000, funds: 50000 };
    cityController.createCity.mockImplementation((req, res) => {
      res.status(201).json(mockCity);
    });

    const response = await request(app)
      .post('/api/cities')
      .send(mockCity);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCity);
  });
});
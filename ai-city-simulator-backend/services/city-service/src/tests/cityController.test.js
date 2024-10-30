import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { createCity } from '../controllers/cityController.js';
import * as cityService from '../services/cityService.js';

jest.mock('../services/cityService.js');

describe('City Controller', () => {
  it('should create a new city', async () => {
    const mockCity = { name: 'New City', population: 1000000, funds: 50000 };
    cityService.createCity.mockResolvedValue(mockCity);

    const req = { body: mockCity };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await createCity(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockCity));
  });
});
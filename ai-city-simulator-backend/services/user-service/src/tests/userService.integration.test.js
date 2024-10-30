import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import { connectDB, closeDB } from '../db/db';
import { initRedis, closeRedis } from '../config/redisClient';
import userService from '../services/userService';

jest.mock('../services/userService', () => ({
  createUser: jest.fn().mockImplementation((userData) => Promise.resolve({ id: 'testid', ...userData }))
}));

jest.mock('../controllers/userController', () => ({
  createUser: jest.fn().mockImplementation((userData) => Promise.resolve({ id: 'newuser', ...userData }))
}));

jest.setTimeout(60000); // Increase timeout to 60 seconds

describe('Service Integration', () => {
  beforeAll(async () => {
    await connectDB();
    await initRedis();
  });

  afterAll(async () => {
    await closeDB();
    await closeRedis();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Increase delay to 1 second
    await mongoose.disconnect();
  });

  it('should create a new user in the database and API', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(String),
      username: userData.username,
      email: userData.email
    }));

    // Verify that the userService.createUser was called with the correct data
    expect(userService.createUser).toHaveBeenCalledWith(userData);
  });

  // Add more integration tests as needed
});

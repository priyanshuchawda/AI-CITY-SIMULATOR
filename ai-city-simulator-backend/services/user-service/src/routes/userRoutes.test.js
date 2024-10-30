import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'; // Import Jest functions explicitly
import request from 'supertest';
import express from 'express';
import userRoutes from './userRoutes';

// Mock the userController functions
jest.mock('../controllers/userController', () => ({
  getUserById: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve({ id: '1', username: 'testuser', email: 'test@example.com' });
    } else {
      return Promise.resolve(null);
    }
  }),
  createUser: jest.fn((userData) => Promise.resolve({ id: 'newuser', ...userData })),
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocks after each test
  });

  it('GET /api/users/:id should return user data', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
  });

  it('GET /api/users/:id should return 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.statusCode).toBe(404);
  });

  // Add more tests for other user routes (e.g., POST, PUT, DELETE)
});

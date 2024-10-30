import { jest, describe, it, expect } from '@jest/globals';
import userController from '../controllers/userController';

jest.mock('../services/userService', () => ({
  createUser: jest.fn().mockResolvedValue({ id: 'testid', username: 'testuser', email: 'test@example.com' }),
}));

describe('User Controller', () => {
  it('should create a new user', async () => {
    const req = { body: { username: 'testuser', email: 'test@example.com', password: 'password123' } };
    const res = { 
      json: jest.fn(), 
      status: jest.fn().mockReturnThis() 
    };

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      username: 'testuser',
      email: 'test@example.com'
    }));
  });
});

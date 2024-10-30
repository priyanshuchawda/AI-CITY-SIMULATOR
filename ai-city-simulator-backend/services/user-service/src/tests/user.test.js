import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import userService from '../services/userService';
import { User } from '../models/User';
import { getAsync, setAsync } from '../config/redisClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors'; // To create HTTP errors

jest.mock('../models/User', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock('../config/redisClient', () => ({
  getAsync: jest.fn(),
  setAsync: jest.fn(),
  client: { del: jest.fn(), quit: jest.fn() },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    User.create.mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue('hashedpassword');

    const result = await userService.createUser(mockUser);
    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith(mockUser);
  });

  it('should get a user by id from cache', async () => {
    const mockUser = { _id: 'user123', username: 'testuser' };
    getAsync.mockResolvedValueOnce(JSON.stringify(mockUser));

    const result = await userService.getUserById('user123');
    expect(result).toEqual(mockUser);
    expect(getAsync).toHaveBeenCalledWith('user:user123');
  });

  it('should get a user by id from database if not in cache', async () => {
    const mockUser = { _id: 'user123', username: 'testuser' };
    getAsync.mockResolvedValueOnce(null);
    User.findById.mockResolvedValue(mockUser);
    setAsync.mockResolvedValue('OK');

    const result = await userService.getUserById('user123');
    expect(result).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(setAsync).toHaveBeenCalledWith('user:user123', JSON.stringify(mockUser), 'EX', expect.any(Number));
  });

  it('should handle user creation errors', async () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    User.create.mockRejectedValue(new Error('Database error'));

    await expect(userService.createUser(mockUser)).rejects.toThrow('Database error');
    expect(User.create).toHaveBeenCalledWith(mockUser);
  });

  it('should update a user by id', async () => {
    const mockUser = { _id: 'user123', username: 'updateduser' };
    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    const result = await userService.updateUser('user123', { username: 'updateduser' });
    expect(result).toEqual(mockUser);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', { username: 'updateduser' }, { new: true });
  });

  it('should delete a user by id', async () => {
    const mockUser = { _id: 'user123' };
    User.findByIdAndDelete.mockResolvedValue(mockUser);
    getAsync.mockResolvedValueOnce(JSON.stringify(mockUser));

    const result = await userService.deleteUser('user123');
    expect(result).toEqual({ message: 'User deleted successfully' });
    expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123');
    expect(getAsync).toHaveBeenCalledWith('user:user123');
  });

  it('should login a user', async () => {
    const mockUser = { _id: 'user123', email: 'test@example.com', username: 'testuser', password: 'hashedpassword' };
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockedtoken');
    User.findOne.mockResolvedValue(mockUser);

    const result = await userService.loginUser('test@example.com', 'password123');
    expect(result).toEqual({ token: 'mockedtoken', user: { id: 'user123', email: 'test@example.com', username: 'testuser' } });
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('should handle login errors', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(userService.loginUser('test@example.com', 'wrongpassword')).rejects.toThrow(createError(401, 'Invalid credentials'));
  });
});

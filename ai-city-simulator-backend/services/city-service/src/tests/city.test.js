// src/tests/city.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import cityRoutes from '../routes/cityRoutes.js';
import * as db from '../db/db.js';
import * as redis from '../config/redisClient.js';
import { MongoClient } from 'mongodb';
import { jest } from '@jest/globals';

jest.mock('mongodb', () => ({
  MongoClient: {
    connect: jest.fn().mockResolvedValue({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
  },
}));

jest.mock('mongoose', () => {
  const mockSchema = jest.fn();
  mockSchema.prototype.index = jest.fn();

  return {
    Schema: mockSchema,
    model: jest.fn(),
    connect: jest.fn(),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
    },
  };
});

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const mockCity = {
  create: jest.fn().mockImplementation((data) => Promise.resolve({ _id: 'mockedId', ...data })),
  find: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByIdAndUpdate: jest.fn().mockResolvedValue(null),
};

jest.mock('../models/City', () => mockCity);

const app = express();
app.use(express.json());
app.use('/api/city', cityRoutes);

// Add your test cases here

// jest.setup.js

// Import jest and afterAll from '@jest/globals'
import { afterAll } from '@jest/globals';

// Update Jest setup files
afterAll(() => {
  jest.restoreAllMocks();
});

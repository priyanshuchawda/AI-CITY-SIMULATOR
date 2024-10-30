// Import Jest functions
import { afterAll } from '@jest/globals';

// Mocking external modules
import { jest } from '@jest/globals';  // Import Jest functions
jest.mock('mongodb');
jest.mock('mongoose');
jest.mock('axios');

// Clean up after all tests
afterAll(() => {
  // Put any cleanup logic here if necessary
});

import { jest, afterAll } from '@jest/globals';  // Explicitly import Jest functions if needed

// Set a custom timeout for Jest tests
jest.setTimeout(30000);

afterAll(async () => {
  // Delay to avoid "Jest open handle" error
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});

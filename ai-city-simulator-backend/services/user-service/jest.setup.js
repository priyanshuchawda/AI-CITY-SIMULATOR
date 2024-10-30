import { jest, afterAll } from '@jest/globals';

jest.setTimeout(30000);

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // avoid jest open handle error
});

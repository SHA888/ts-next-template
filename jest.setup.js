// Setup file for Jest tests
console.log('Setting up test environment...');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://user:password@localhost:5432/testdb';

// Global test timeout
jest.setTimeout(30000);

// Global test teardown
afterAll(async () => {
  // Add any global cleanup here
  console.log('Test environment teardown complete');
});

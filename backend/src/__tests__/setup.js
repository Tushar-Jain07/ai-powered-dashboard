// Test setup file
const mongoose = require('mongoose');

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/ai-dashboard-test';

// Global test timeout
jest.setTimeout(10000);

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  // Clean up test database
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

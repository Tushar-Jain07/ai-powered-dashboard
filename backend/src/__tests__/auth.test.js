const request = require('supertest');
const app = require('../index'); // Import the app from index.js
const mongoose = require('mongoose');
const User = require('../models/User'); // Re-added to clear users

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Ensure the database is connected before tests run
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    await User.deleteMany({}); // Clear database once before all tests
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123456'
      };

      // Create user first
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to register again
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Attempt to login first, if user doesn't exist, then register
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123456'
      };

      let loginResponse = await request(app)
        .post('/api/auth/login')
        .send(userData);

      if (loginResponse.status === 401) { // User not found or invalid credentials, so register
        await request(app)
          .post('/api/auth/register')
          .send(userData);
      }
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should login with demo credentials', async () => {
      const demoData = {
        email: 'demo@ai-dashmind.com',
        password: 'demo123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(demoData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.isDemo).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(async () => {
      // Create and login user once for all tests in this block
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123456'
      };

      let registerResponse;
      let retries = 3;
      while (retries > 0) {
        registerResponse = await request(app)
          .post('/api/auth/register')
          .send(userData);

        if (registerResponse.status === 429) {
          console.warn('Rate limit hit during registration, retrying...');
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        } else {
          break;
        }
      }

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.token).toBeDefined();

      token = registerResponse.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });

    it('should not get user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid token');
    });
  });
});

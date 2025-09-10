const request = require('supertest');
const app = require('../../src/server');
const database = require('../../src/database/database');

describe('User API - End-to-End Tests', () => {
  beforeEach(async () => {
    database.users.clear();
  });

  describe('POST /api/users - Create user', () => {
    it('should create user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: 'John Doe',
        email: 'john@email.com'
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.password).toBeUndefined();
      expect(response.body.message).toBe('User created successfully');
    });

    it('should return 400 error for invalid data', async () => {
      const invalidUserData = {
        name: 'J',
        email: 'invalid-email',
        password: '123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid data');
    });

    it('should return 400 error for duplicate email', async () => {
      const userData1 = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const userData2 = {
        name: 'John Smith',
        email: 'john@email.com',
        password: 'OtherPass@456'
      };

      await request(app)
        .post('/api/users')
        .send(userData1)
        .expect(201);

      const response = await request(app)
        .post('/api/users')
        .send(userData2)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email already in use');
    });

    it('should return 400 error for missing required fields', async () => {
      const incompleteUserData = {
        name: 'John Doe'
      };

      const response = await request(app)
        .post('/api/users')
        .send(incompleteUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid data');
    });
  });

  describe('GET /api/users/:id - Get user by ID', () => {
    it('should return existing user', async () => {
      const userData = {
        name: 'Mary Smith',
        email: 'mary@email.com',
        password: 'MyPass@123'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: userId,
        name: 'Mary Smith',
        email: 'mary@email.com'
      });
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 404 error for nonexistent user', async () => {
      const nonExistentId = 'uuid-nonexistent';

      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('GET /api/users - List all users', () => {
    it('should return list of users', async () => {
      const usersData = [
        { name: 'User 1', email: 'user1@email.com', password: 'MyPass@123' },
        { name: 'User 2', email: 'user2@email.com', password: 'MyPass@456' }
      ];

      for (const userData of usersData) {
        await request(app)
          .post('/api/users')
          .send(userData);
      }

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      
      response.body.data.forEach(user => {
        expect(user.password).toBeUndefined();
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
      });
    });

    it('should return empty list when no users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe('PUT /api/users/:id - Update user', () => {
    it('should update existing user', async () => {
      const userData = {
        name: 'Carlos Silva',
        email: 'carlos@email.com',
        password: 'MyPass@123'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createResponse.body.data.id;
      const updateData = {
        name: 'Carlos Smith',
        email: 'carlos.new@email.com'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: userId,
        name: 'Carlos Smith',
        email: 'carlos.new@email.com'
      });
      expect(response.body.message).toBe('User updated successfully');
    });

    it('should return 404 error for nonexistent user', async () => {
      const nonExistentId = 'uuid-nonexistent';
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/api/users/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id - Delete user', () => {
    it('should delete existing user', async () => {
      const userData = {
        name: 'Pedro Silva',
        email: 'pedro@email.com',
        password: 'MyPass@123'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');

      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    it('should return 404 error for nonexistent user', async () => {
      const nonExistentId = 'uuid-nonexistent';

      const response = await request(app)
        .delete(`/api/users/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/users/login - Validate credentials', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        name: 'Ana Costa',
        email: 'ana@email.com',
        password: 'MyPass@123'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      const loginData = {
        email: 'ana@email.com',
        password: 'MyPass@123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: 'Ana Costa',
        email: 'ana@email.com'
      });
      expect(response.body.data.password).toBeUndefined();
      expect(response.body.message).toBe('Login successful');
    });

    it('should return 401 error for invalid credentials', async () => {
      const userData = {
        name: 'Roberto Silva',
        email: 'roberto@email.com',
        password: 'MyPass@123'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      const loginData = {
        email: 'roberto@email.com',
        password: 'WrongPass123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 401 error for nonexistent user', async () => {
      const loginData = {
        email: 'nonexistent@email.com',
        password: 'AnyPass123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 400 error for missing data', async () => {
      const incompleteLoginData = {
        email: 'ana@email.com'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(incompleteLoginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('Health Check', () => {
    it('should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('404 - Endpoint not found', () => {
    it('should return 404 error for nonexistent endpoint', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});
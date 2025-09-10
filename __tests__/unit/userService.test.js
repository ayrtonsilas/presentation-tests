const bcrypt = require('bcryptjs');
const userService = require('../../src/services/userService');
const database = require('../../src/database/database');

jest.mock('../../src/database/database');

describe('UserService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    database.users.clear();
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const mockUser = {
        id: 'uuid-123',
        ...userData,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      database.findUserByEmail.mockResolvedValue(null);
      database.createUser.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual({
        id: 'uuid-123',
        name: 'John Doe',
        email: 'john@email.com',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      });
      expect(database.findUserByEmail).toHaveBeenCalledWith('john@email.com');
      expect(database.createUser).toHaveBeenCalled();
      expect(result.password).toBeUndefined();
    });

    it('should throw error when email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const existingUser = {
        id: 'uuid-existing',
        email: 'john@email.com'
      };

      database.findUserByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Email already in use');
    });

    it('should throw error with invalid data', async () => {
      const invalidUserData = {
        name: 'J',
        email: 'invalid-email',
        password: '123'
      };

      await expect(userService.createUser(invalidUserData))
        .rejects
        .toThrow('Invalid data');
    });

    it('should hash password before saving', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const mockUser = {
        id: 'uuid-123',
        ...userData,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      database.findUserByEmail.mockResolvedValue(null);
      database.createUser.mockResolvedValue(mockUser);

      await userService.createUser(userData);

      expect(database.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@email.com',
          password: expect.not.stringMatching('MyPass@123')
        })
      );
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = 'uuid-123';
      const mockUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@email.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      database.findUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual({
        id: userId,
        name: 'John Doe',
        email: 'john@email.com',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      });
      expect(database.findUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found', async () => {
      const userId = 'uuid-nonexistent';
      database.findUserById.mockResolvedValue(null);

      await expect(userService.getUserById(userId))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error when ID not provided', async () => {
      await expect(userService.getUserById())
        .rejects
        .toThrow('ID is required');
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid credentials', async () => {
      const email = 'john@email.com';
      const password = 'MyPass@123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser = {
        id: 'uuid-123',
        email,
        password: hashedPassword
      };

      database.findUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.validatePassword(email, password);

      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const email = 'john@email.com';
      const correctPassword = 'MyPass@123';
      const wrongPassword = 'WrongPass123';
      const hashedPassword = await bcrypt.hash(correctPassword, 10);

      const mockUser = {
        id: 'uuid-123',
        email,
        password: hashedPassword
      };

      database.findUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.validatePassword(email, wrongPassword);

      expect(result).toBe(false);
    });

    it('should return false for nonexistent user', async () => {
      const email = 'nonexistent@email.com';
      const password = 'MyPass@123';

      database.findUserByEmail.mockResolvedValue(null);

      const result = await userService.validatePassword(email, password);

      expect(result).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user with valid data', async () => {
      const userId = 'uuid-123';
      const updateData = {
        name: 'John Updated',
        email: 'john.new@email.com'
      };

      const mockUpdatedUser = {
        id: userId,
        name: 'John Updated',
        email: 'john.new@email.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      database.updateUser.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual({
        id: userId,
        name: 'John Updated',
        email: 'john.new@email.com',
        createdAt: mockUpdatedUser.createdAt,
        updatedAt: mockUpdatedUser.updatedAt
      });
      expect(database.updateUser).toHaveBeenCalledWith(userId, updateData);
    });

    it('should hash password when updating', async () => {
      const userId = 'uuid-123';
      const updateData = {
        password: 'NewPass@123'
      };

      const mockUpdatedUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@email.com',
        password: 'new-hashed-password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      database.updateUser.mockResolvedValue(mockUpdatedUser);

      await userService.updateUser(userId, updateData);

      expect(database.updateUser).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          password: expect.not.stringMatching('NewPass@123')
        })
      );
    });
  });
});
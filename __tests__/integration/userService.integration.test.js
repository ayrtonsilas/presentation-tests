const userService = require('../../src/services/userService');
const database = require('../../src/database/database');

describe('UserService - Integration Tests', () => {
  beforeEach(async () => {
    database.users.clear();
  });

  describe('createUser - Database integration', () => {
    it('should create user and persist in database', async () => {
      const userData = {
        name: 'Mary Smith',
        email: 'mary@email.com',
        password: 'MyPass@123'
      };

      const createdUser = await userService.createUser(userData);

      expect(createdUser).toMatchObject({
        name: 'Mary Smith',
        email: 'mary@email.com'
      });
      expect(createdUser.id).toBeDefined();
      expect(createdUser.password).toBeUndefined();

      const savedUser = await database.findUserById(createdUser.id);
      expect(savedUser).toBeDefined();
      expect(savedUser.name).toBe('Mary Smith');
      expect(savedUser.email).toBe('mary@email.com');
      expect(savedUser.password).not.toBe('MyPass@123');
    });

    it('should prevent creation of user with duplicate email', async () => {
      // TODO: Implement this test
      // Test that creating two users with same email fails
    });

    it('should validate data before saving to database', async () => {
      const invalidUserData = {
        name: 'J',
        email: 'invalid-email',
        password: '123'
      };

      await expect(userService.createUser(invalidUserData))
        .rejects
        .toThrow('Invalid data');

      const allUsers = await database.getAllUsers();
      expect(allUsers).toHaveLength(0);
    });
  });

  describe('getUserById - Database integration', () => {
    it('should find existing user in database', async () => {
      const userData = {
        name: 'Ana Costa',
        email: 'ana@email.com',
        password: 'MyPass@123'
      };

      const createdUser = await userService.createUser(userData);

      const foundUser = await userService.getUserById(createdUser.id);

      expect(foundUser).toMatchObject({
        id: createdUser.id,
        name: 'Ana Costa',
        email: 'ana@email.com'
      });
      expect(foundUser.password).toBeUndefined();
    });

    it('should return error for nonexistent user', async () => {
      const nonExistentId = 'uuid-nonexistent';

      await expect(userService.getUserById(nonExistentId))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('updateUser - Database integration', () => {
    it('should update existing user in database', async () => {
      const userData = {
        name: 'Carlos Silva',
        email: 'carlos@email.com',
        password: 'MyPass@123'
      };

      const createdUser = await userService.createUser(userData);
      const updateData = {
        name: 'Carlos Smith',
        email: 'carlos.new@email.com'
      };

      const updatedUser = await userService.updateUser(createdUser.id, updateData);

      expect(updatedUser).toMatchObject({
        id: createdUser.id,
        name: 'Carlos Smith',
        email: 'carlos.new@email.com'
      });

      const savedUser = await database.findUserById(createdUser.id);
      expect(savedUser.name).toBe('Carlos Smith');
      expect(savedUser.email).toBe('carlos.new@email.com');
    });

    it('should update password with correct hash', async () => {
      const userData = {
        name: 'Pedro Silva',
        email: 'pedro@email.com',
        password: 'MyPass@123'
      };

      const createdUser = await userService.createUser(userData);
      const updateData = {
        password: 'NewPass@456'
      };

      await userService.updateUser(createdUser.id, updateData);

      const savedUser = await database.findUserById(createdUser.id);
      expect(savedUser.password).not.toBe('NewPass@456');
      expect(savedUser.password).not.toBe('MyPass@123');
      expect(savedUser.password.length).toBeGreaterThan(50);
    });
  });

  describe('deleteUser - Database integration', () => {
    it('should delete user from database', async () => {
      const userData = {
        name: 'Lucas Silva',
        email: 'lucas@email.com',
        password: 'MyPass@123'
      };

      const createdUser = await userService.createUser(userData);

      const result = await userService.deleteUser(createdUser.id);

      expect(result.message).toBe('User deleted successfully');

      const deletedUser = await database.findUserById(createdUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should return error when trying to delete nonexistent user', async () => {
      const nonExistentId = 'uuid-nonexistent';

      await expect(userService.deleteUser(nonExistentId))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('validatePassword - Database integration', () => {
    it('should validate correct password of existing user', async () => {
      const userData = {
        name: 'Fernanda Silva',
        email: 'fernanda@email.com',
        password: 'MyPass@123'
      };

      await userService.createUser(userData);

      const isValid = await userService.validatePassword('fernanda@email.com', 'MyPass@123');

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const userData = {
        name: 'Roberto Silva',
        email: 'roberto@email.com',
        password: 'MyPass@123'
      };

      await userService.createUser(userData);

      const isValid = await userService.validatePassword('roberto@email.com', 'WrongPass123');

      expect(isValid).toBe(false);
    });

    it('should return false for nonexistent user', async () => {
      const isValid = await userService.validatePassword('nonexistent@email.com', 'AnyPass123');

      expect(isValid).toBe(false);
    });
  });

  describe('getAllUsers - Database integration', () => {
    it('should return all users from database', async () => {
      const usersData = [
        { name: 'User 1', email: 'user1@email.com', password: 'MyPass@123' },
        { name: 'User 2', email: 'user2@email.com', password: 'MyPass@456' },
        { name: 'User 3', email: 'user3@email.com', password: 'MyPass@789' }
      ];

      for (const userData of usersData) {
        await userService.createUser(userData);
      }

      const allUsers = await userService.getAllUsers();

      expect(allUsers).toHaveLength(3);
      allUsers.forEach(user => {
        expect(user.password).toBeUndefined();
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
      });
    });

    it('should return empty array when no users', async () => {
      const allUsers = await userService.getAllUsers();

      expect(allUsers).toHaveLength(0);
      expect(Array.isArray(allUsers)).toBe(true);
    });
  });
});
const { validateUser } = require('../../src/validators/userValidator');

describe('UserValidator - Unit Tests', () => {
  describe('validateUser', () => {
    it('should validate correct user data', () => {
      const validUserData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const result = validateUser(validUserData);

      expect(result.error).toBeUndefined();
      expect(result.value).toEqual(validUserData);
    });

    it('should reject name too short', () => {
      const invalidUserData = {
        name: 'J',
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Name must have at least 2 characters');
    });

    it('should reject name too long', () => {
      const invalidUserData = {
        name: 'A'.repeat(101),
        email: 'john@email.com',
        password: 'MyPass@123'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Name must have at most 100 characters');
    });

    it('should reject invalid email', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'MyPass@123'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Email must have a valid format');
    });

    it('should reject password too short', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: '123'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Password must have at least 6 characters');
    });

    it('should reject password without uppercase', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'mypassword123'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Password must contain at least: 1 lowercase letter, 1 uppercase letter and 1 number');
    });

    it('should reject password without lowercase', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MYPASSWORD123'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Password must contain at least: 1 lowercase letter, 1 uppercase letter and 1 number');
    });

    it('should reject password without number', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPassword'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('Password must contain at least: 1 lowercase letter, 1 uppercase letter and 1 number');
    });

    it('should reject missing required fields', () => {
      const invalidUserData = {
        name: 'John Doe'
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details).toHaveLength(2);
      expect(result.error.details.some(d => d.message.includes('Email is required'))).toBe(true);
      expect(result.error.details.some(d => d.message.includes('Password is required'))).toBe(true);
    });

    it('should reject empty data', () => {
      const invalidUserData = {
        name: '',
        email: '',
        password: ''
      };

      const result = validateUser(invalidUserData);

      expect(result.error).toBeDefined();
      expect(result.error.details.length).toBeGreaterThan(0);
    });

    it('should accept password with special characters', () => {
      const validUserData = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'MyPass@123!@#'
      };

      const result = validateUser(validUserData);

      expect(result.error).toBeUndefined();
      expect(result.value).toEqual(validUserData);
    });
  });
});
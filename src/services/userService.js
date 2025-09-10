const bcrypt = require('bcryptjs');
const database = require('../database/database');
const User = require('../models/User');
const { validateUser } = require('../validators/userValidator');

class UserService {
  async createUser(userData) {
    const { error, value } = validateUser(userData);
    if (error) {
      throw new Error(`Invalid data: ${error.details.map(d => d.message).join(', ')}`);
    }

    const existingUser = await database.findUserByEmail(value.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    const userDataWithHash = {
      ...value,
      password: hashedPassword
    };

    const createdUser = await database.createUser(userDataWithHash);
    
    const user = new User(createdUser);
    return user.toSafeJSON();
  }

  async getUserById(id) {
    if (!id) {
      throw new Error('ID is required');
    }

    const userData = await database.findUserById(id);
    if (!userData) {
      throw new Error('User not found');
    }

    const user = new User(userData);
    return user.toSafeJSON();
  }

  async getUserByEmail(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    const userData = await database.findUserByEmail(email);
    if (!userData) {
      throw new Error('User not found');
    }

    const user = new User(userData);
    return user.toSafeJSON();
  }

  async updateUser(id, updateData) {
    if (!id) {
      throw new Error('ID is required');
    }

    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUserData = await database.updateUser(id, updateData);
    if (!updatedUserData) {
      throw new Error('User not found');
    }

    const user = new User(updatedUserData);
    return user.toSafeJSON();
  }

  async deleteUser(id) {
    if (!id) {
      throw new Error('ID is required');
    }

    const deleted = await database.deleteUser(id);
    if (!deleted) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  async getAllUsers() {
    const usersData = await database.getAllUsers();
    return usersData.map(userData => {
      const user = new User(userData);
      return user.toSafeJSON();
    });
  }

  async validatePassword(email, password) {
    const userData = await database.findUserByEmail(email);
    if (!userData) {
      return false;
    }

    return await bcrypt.compare(password, userData.password);
  }
}

module.exports = new UserService();

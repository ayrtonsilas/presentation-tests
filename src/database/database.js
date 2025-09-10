const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }
  async createUser(userData) {
    const id = uuidv4();
    const user = {
      id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id, updateData) {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id) {
    return this.users.delete(id);
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }

  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const database = new Database();

module.exports = database;

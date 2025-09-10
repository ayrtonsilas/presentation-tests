class User {
  constructor({ id, name, email, password, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toSafeJSON() {
    const { password, ...safeUser } = this.toJSON();
    return safeUser;
  }
}

module.exports = User;

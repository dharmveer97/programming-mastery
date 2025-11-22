import { describe, it, expect } from 'vitest';

/**
 * Exercise 207: Factory Pattern - SOLUTION
 */

class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  describe() {
    return `${this.name} is a ${this.role}`;
  }
}

class Admin extends User {
  constructor(name) {
    super(name, 'admin');
  }

  manageUsers() {
    return 'Managing users...';
  }
}

class RegularUser extends User {
  constructor(name) {
    super(name, 'user');
  }

  viewContent() {
    return 'Viewing content...';
  }
}

class Guest extends User {
  constructor(name) {
    super(name, 'guest');
  }

  browse() {
    return 'Browsing publicly...';
  }
}

export class UserFactory {
  static createUser(type, name) {
    switch (type) {
      case 'admin':
        return new Admin(name);
      case 'user':
        return new RegularUser(name);
      case 'guest':
        return new Guest(name);
      default:
        throw new Error(`Invalid user type: ${type}`);
    }
  }
}

// Alternative: Using object mapping
export class UserFactoryAlt {
  static types = {
    admin: Admin,
    user: RegularUser,
    guest: Guest
  };

  static createUser(type, name) {
    const UserClass = this.types[type];
    if (!UserClass) {
      throw new Error(`Invalid user type: ${type}`);
    }
    return new UserClass(name);
  }
}

// Tests
describe('Exercise 207: Factory Pattern - Solution', () => {
  it('should create admin user', () => {
    const admin = UserFactory.createUser('admin', 'Alice');

    expect(admin.role).toBe('admin');
    expect(admin.describe()).toBe('Alice is a admin');
    expect(admin.manageUsers()).toBe('Managing users...');
  });

  it('should create regular user', () => {
    const user = UserFactory.createUser('user', 'Bob');

    expect(user.role).toBe('user');
    expect(user.viewContent()).toBe('Viewing content...');
  });

  it('should create guest', () => {
    const guest = UserFactory.createUser('guest', 'Charlie');

    expect(guest.role).toBe('guest');
    expect(guest.browse()).toBe('Browsing publicly...');
  });

  it('should throw error for invalid type', () => {
    expect(() => UserFactory.createUser('invalid', 'Dave')).toThrow();
  });
});

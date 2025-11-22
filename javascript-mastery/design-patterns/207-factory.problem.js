import { describe, it, expect } from 'vitest';

/**
 * Exercise 207: Factory Pattern
 *
 * The Factory pattern provides an interface for creating objects
 * without specifying their exact classes.
 *
 * Use Cases:
 * - Creating different types of objects based on input
 * - Complex object creation logic
 * - Hiding creation details from client
 *
 * Example: Creating different user types (Admin, Regular, Guest)
 *
 * Task: Implement a User Factory
 */

// Base User class (provided)
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  describe() {
    return `${this.name} is a ${this.role}`;
  }
}

// TODO: Create specific user classes
class Admin extends User {
  constructor(name) {
    super(name, 'admin');
  }

  // TODO: Add admin-specific method
  manageUsers() {
    // Your code here
  }
}

class RegularUser extends User {
  constructor(name) {
    super(name, 'user');
  }

  // TODO: Add regular user method
  viewContent() {
    // Your code here
  }
}

class Guest extends User {
  constructor(name) {
    super(name, 'guest');
  }

  // TODO: Add guest method
  browse() {
    // Your code here
  }
}

// TODO: Implement UserFactory
export class UserFactory {
  static createUser(type, name) {
    // Your code here
  }
}

// Tests
describe('Exercise 207: Factory Pattern', () => {
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

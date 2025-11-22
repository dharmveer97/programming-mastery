import { describe, it, expect } from 'vitest';

/**
 * Exercise 206: Singleton Pattern
 *
 * The Singleton pattern ensures a class has only ONE instance
 * and provides a global point of access to it.
 *
 * Use Cases:
 * - Database connections
 * - Configuration objects
 * - Logging services
 * - Cache managers
 *
 * Key Concepts:
 * - Private constructor (prevent new instances)
 * - Static getInstance() method
 * - Store single instance
 *
 * Task: Implement a Singleton class
 */

// TODO: Implement Singleton pattern
export class Database {
  // TODO: Store the single instance

  // TODO: Private constructor (simulate with convention)
  constructor() {
    // Your code here
  }

  // TODO: Static method to get instance
  static getInstance() {
    // Your code here
  }

  // Example methods
  connect() {
    return 'Connected to database';
  }

  query(sql) {
    return `Executing: ${sql}`;
  }
}

// Tests
describe('Exercise 206: Singleton Pattern', () => {
  it('should create only one instance', () => {
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();

    expect(db1).toBe(db2); // Same instance
  });

  it('should have working methods', () => {
    const db = Database.getInstance();

    expect(db.connect()).toBe('Connected to database');
    expect(db.query('SELECT * FROM users')).toBe('Executing: SELECT * FROM users');
  });

  it('should share state across instances', () => {
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();

    // Add a property to db1
    db1.customProperty = 'shared value';

    // db2 should have the same property
    expect(db2.customProperty).toBe('shared value');
  });
});

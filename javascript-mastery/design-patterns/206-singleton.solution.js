import { describe, it, expect } from 'vitest';

/**
 * Exercise 206: Singleton Pattern - SOLUTION
 */

export class Database {
  // Store the single instance
  static instance = null;

  constructor() {
    // Return existing instance if it exists
    if (Database.instance) {
      return Database.instance;
    }

    // Initialize the instance
    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect() {
    return 'Connected to database';
  }

  query(sql) {
    return `Executing: ${sql}`;
  }
}

// Alternative implementation using closure
export const DatabaseClosure = (() => {
  let instance;

  class Database {
    connect() {
      return 'Connected to database';
    }

    query(sql) {
      return `Executing: ${sql}`;
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = new Database();
      }
      return instance;
    }
  };
})();

// Tests
describe('Exercise 206: Singleton Pattern - Solution', () => {
  it('should create only one instance', () => {
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();

    expect(db1).toBe(db2);
  });

  it('should have working methods', () => {
    const db = Database.getInstance();

    expect(db.connect()).toBe('Connected to database');
    expect(db.query('SELECT * FROM users')).toBe('Executing: SELECT * FROM users');
  });

  it('should share state across instances', () => {
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();

    db1.customProperty = 'shared value';
    expect(db2.customProperty).toBe('shared value');
  });

  it('should work with closure implementation', () => {
    const db1 = DatabaseClosure.getInstance();
    const db2 = DatabaseClosure.getInstance();

    expect(db1).toBe(db2);
  });
});

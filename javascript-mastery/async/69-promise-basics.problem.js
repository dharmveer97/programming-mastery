import { describe, it, expect } from 'vitest';

/**
 * Exercise 69: Promise Basics
 *
 * A Promise represents the eventual completion (or failure)
 * of an asynchronous operation.
 *
 * States:
 * - Pending: Initial state
 * - Fulfilled: Operation completed successfully
 * - Rejected: Operation failed
 *
 * Task: Create and work with promises
 */

// TODO: Create a promise that resolves with a value after a delay
export function createDelayedPromise(value, delay) {
  // Your code here
  // Hint: Use setTimeout inside a Promise
}

// TODO: Create a promise that immediately resolves
export function createResolvedPromise(value) {
  // Your code here
}

// TODO: Create a promise that immediately rejects
export function createRejectedPromise(error) {
  // Your code here
}

// TODO: Fetch user data (simulate API call with promise)
// Resolve after 100ms with: { id: userId, name: 'User' + userId }
export function fetchUser(userId) {
  // Your code here
}

// Tests
describe('Exercise 69: Promise Basics', () => {
  it('should create delayed promise', async () => {
    const start = Date.now();
    const result = await createDelayedPromise('hello', 100);
    const elapsed = Date.now() - start;

    expect(result).toBe('hello');
    expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some margin
  });

  it('should create immediately resolved promise', async () => {
    const result = await createResolvedPromise(42);
    expect(result).toBe(42);
  });

  it('should create immediately rejected promise', async () => {
    try {
      await createRejectedPromise('error message');
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBe('error message');
    }
  });

  it('should fetch user data', async () => {
    const user = await fetchUser(123);
    expect(user).toEqual({ id: 123, name: 'User123' });
  });
});

import { describe, it, expect } from 'vitest';

/**
 * Exercise 69: Promise Basics - SOLUTION
 */

export function createDelayedPromise(value, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, delay);
  });
}

export function createResolvedPromise(value) {
  return Promise.resolve(value);
}

export function createRejectedPromise(error) {
  return Promise.reject(error);
}

export function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'User' + userId
      });
    }, 100);
  });
}

// Tests
describe('Exercise 69: Promise Basics - Solution', () => {
  it('should create delayed promise', async () => {
    const start = Date.now();
    const result = await createDelayedPromise('hello', 100);
    const elapsed = Date.now() - start;

    expect(result).toBe('hello');
    expect(elapsed).toBeGreaterThanOrEqual(90);
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

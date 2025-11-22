import { describe, it, expect } from 'vitest';

/**
 * Exercise 164: Promise Basics
 *
 * WHAT IS A PROMISE?
 * A Promise is an object representing the eventual completion
 * or failure of an asynchronous operation.
 *
 * PROMISE STATES:
 * 1. Pending - Initial state, neither fulfilled nor rejected
 * 2. Fulfilled - Operation completed successfully (resolved)
 * 3. Rejected - Operation failed
 *
 * CREATING PROMISES:
 * new Promise((resolve, reject) => {
 *   // async operation
 *   if (success) resolve(value);
 *   else reject(error);
 * });
 *
 * CONSUMING PROMISES:
 * promise
 *   .then(value => { ... })      // Handle success
 *   .catch(error => { ... })     // Handle error
 *   .finally(() => { ... })      // Cleanup
 *
 * BENEFITS OVER CALLBACKS:
 * - Better error handling
 * - Easier to chain
 * - Avoid callback hell
 * - Better readability
 *
 * Task: Learn to create and consume promises
 */

// TODO: Create a promise that resolves with a value
export function createResolvedPromise(value) {
  // Your code here
  // Return a promise that resolves with the given value
}

// TODO: Create a promise that rejects with an error
export function createRejectedPromise(message) {
  // Your code here
  // Return a promise that rejects with Error(message)
}

// TODO: Create a delayed promise
export function delay(ms) {
  // Your code here
  // Return a promise that resolves after ms milliseconds
  // Use setTimeout
}

// TODO: Convert callback-based function to promise
export function fetchUserPromise(userId) {
  // Your code here
  // Return a promise that:
  // 1. Validates userId (number > 0)
  // 2. Resolves with user object after delay
  // 3. Rejects if invalid or not found
}

// TODO: Implement timeout wrapper for promises
export function withTimeout(promise, timeoutMs) {
  // Your code here
  // Return a promise that:
  // 1. Resolves/rejects with the original promise
  // 2. Rejects with timeout error if too slow
  // Hint: Use Promise.race()
}

// TODO: Implement retry logic with promises
export function retry(fn, maxAttempts) {
  // Your code here
  // fn: function that returns a promise
  // Retry if promise rejects
  // Max maxAttempts times
  // Return promise that resolves or rejects after all attempts
}

// TODO: Create a promise that tracks state changes
export function createTrackedPromise(executor) {
  // Your code here
  // Return an object with:
  // - promise: the actual promise
  // - state: 'pending', 'fulfilled', or 'rejected'
  // - result: the resolved value or rejected error
}

// Tests
describe('Exercise 164: Promise Basics', () => {
  it('should create resolved promise', async () => {
    const promise = createResolvedPromise(42);
    // TODO: Add expectations
  });

  it('should create rejected promise', async () => {
    const promise = createRejectedPromise('Error!');
    // TODO: Add expectations
    // Use try/catch or .catch()
  });

  it('should delay execution', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    // TODO: Add expectations
  });

  it('should fetch user with promise', async () => {
    const user = await fetchUserPromise(1);
    // TODO: Add expectations
  });

  it('should reject invalid user', async () => {
    try {
      await fetchUserPromise(-1);
      // TODO: Should not reach here
    } catch (err) {
      // TODO: Add expectations
    }
  });

  it('should timeout slow promises', async () => {
    const slowPromise = delay(200).then(() => 'done');

    try {
      await withTimeout(slowPromise, 100);
      // TODO: Should not reach here
    } catch (err) {
      // TODO: Add expectations
    }
  });

  it('should not timeout fast promises', async () => {
    const fastPromise = delay(50).then(() => 'done');
    const result = await withTimeout(fastPromise, 100);
    // TODO: Add expectations
  });

  it('should retry failed operations', async () => {
    let attempts = 0;
    const flakeyFn = () => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Fail'));
      }
      return Promise.resolve('Success');
    };

    const result = await retry(flakeyFn, 5);
    // TODO: Add expectations
  });

  it('should track promise state', async () => {
    const tracked = createTrackedPromise((resolve) => {
      setTimeout(() => resolve(42), 50);
    });

    // TODO: Add expectations for initial state
    // TODO: Wait and check final state
  });
});

/**
 * PROMISE PATTERNS:
 *
 * 1. Creating Promises:
 *    new Promise((resolve, reject) => { ... })
 *    Promise.resolve(value)
 *    Promise.reject(error)
 *
 * 2. Consuming Promises:
 *    promise.then(onFulfilled, onRejected)
 *    promise.catch(onRejected)
 *    promise.finally(onFinally)
 *
 * 3. Promise Methods:
 *    Promise.all([...])       - Wait for all
 *    Promise.race([...])      - Wait for first
 *    Promise.allSettled([...]) - Wait for all to settle
 *    Promise.any([...])       - Wait for first success
 *
 * 4. Common Patterns:
 *    - Delay/timeout
 *    - Retry logic
 *    - Converting callbacks
 *    - Error handling
 *
 * 5. Best Practices:
 *    - Always handle errors (.catch)
 *    - Use finally for cleanup
 *    - Don't create unnecessary promises
 *    - Prefer async/await for readability
 */

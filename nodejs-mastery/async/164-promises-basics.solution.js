import { describe, it, expect } from 'vitest';

/**
 * Exercise 164: Promise Basics - SOLUTION
 */

// Simple resolved promise
export function createResolvedPromise(value) {
  return Promise.resolve(value);
  // Or: return new Promise(resolve => resolve(value));
}

// Simple rejected promise
export function createRejectedPromise(message) {
  return Promise.reject(new Error(message));
  // Or: return new Promise((_, reject) => reject(new Error(message)));
}

// Delay utility
export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Convert callback to promise
const users = {
  1: { id: 1, name: 'Alice', email: 'alice@example.com' },
  2: { id: 2, name: 'Bob', email: 'bob@example.com' },
};

export function fetchUserPromise(userId) {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      return reject(new Error('Invalid userId: must be a positive number'));
    }

    // Simulate async operation
    setTimeout(() => {
      const user = users[userId];
      if (!user) {
        reject(new Error(`User ${userId} not found`));
      } else {
        resolve(user);
      }
    }, 10);
  });
}

// Timeout wrapper
export function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  // Race between original promise and timeout
  return Promise.race([promise, timeoutPromise]);
}

// Retry logic
export function retry(fn, maxAttempts) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function attempt() {
      attempts++;

      fn()
        .then(resolve)
        .catch(err => {
          if (attempts >= maxAttempts) {
            reject(new Error(`Failed after ${maxAttempts} attempts: ${err.message}`));
          } else {
            // Exponential backoff
            const delay = Math.pow(2, attempts) * 100;
            setTimeout(attempt, delay);
          }
        });
    }

    attempt();
  });
}

// Track promise state
export function createTrackedPromise(executor) {
  const tracker = {
    state: 'pending',
    result: undefined,
    promise: null,
  };

  tracker.promise = new Promise((resolve, reject) => {
    executor(
      (value) => {
        tracker.state = 'fulfilled';
        tracker.result = value;
        resolve(value);
      },
      (error) => {
        tracker.state = 'rejected';
        tracker.result = error;
        reject(error);
      }
    );
  });

  return tracker;
}

// Tests
describe('Exercise 164: Promise Basics - Solution', () => {
  it('should create resolved promise', async () => {
    const promise = createResolvedPromise(42);
    expect(promise).toBeInstanceOf(Promise);
    const result = await promise;
    expect(result).toBe(42);
  });

  it('should create rejected promise', async () => {
    const promise = createRejectedPromise('Error!');
    expect(promise).toBeInstanceOf(Promise);

    try {
      await promise;
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Error!');
    }
  });

  it('should handle rejected promise with catch', async () => {
    const promise = createRejectedPromise('Test error');

    await promise.catch(err => {
      expect(err.message).toBe('Test error');
    });
  });

  it('should delay execution', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(95); // Allow some margin
    expect(elapsed).toBeLessThan(150);
  });

  it('should fetch user with promise', async () => {
    const user = await fetchUserPromise(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.name).toBe('Alice');
  });

  it('should reject invalid user', async () => {
    try {
      await fetchUserPromise(-1);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('Invalid userId');
    }
  });

  it('should reject user not found', async () => {
    try {
      await fetchUserPromise(999);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('not found');
    }
  });

  it('should timeout slow promises', async () => {
    const slowPromise = delay(200).then(() => 'done');

    try {
      await withTimeout(slowPromise, 100);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('timed out');
    }
  });

  it('should not timeout fast promises', async () => {
    const fastPromise = delay(50).then(() => 'done');
    const result = await withTimeout(fastPromise, 100);
    expect(result).toBe('done');
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
    expect(result).toBe('Success');
    expect(attempts).toBe(3);
  }, 10000);

  it('should fail after max retries', async () => {
    const alwaysFail = () => Promise.reject(new Error('Always fails'));

    try {
      await retry(alwaysFail, 3);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toContain('Failed after 3 attempts');
    }
  }, 10000);

  it('should track promise state', async () => {
    const tracked = createTrackedPromise((resolve) => {
      setTimeout(() => resolve(42), 50);
    });

    expect(tracked.state).toBe('pending');
    expect(tracked.promise).toBeInstanceOf(Promise);

    const result = await tracked.promise;
    expect(result).toBe(42);
    expect(tracked.state).toBe('fulfilled');
    expect(tracked.result).toBe(42);
  });

  it('should track rejected promise', async () => {
    const tracked = createTrackedPromise((_, reject) => {
      setTimeout(() => reject(new Error('Test error')), 50);
    });

    expect(tracked.state).toBe('pending');

    try {
      await tracked.promise;
      expect.fail('Should have thrown');
    } catch (err) {
      expect(tracked.state).toBe('rejected');
      expect(tracked.result).toBeInstanceOf(Error);
      expect(tracked.result.message).toBe('Test error');
    }
  });

  it('should use finally for cleanup', async () => {
    let cleaned = false;

    await Promise.resolve(42)
      .then(value => value * 2)
      .finally(() => {
        cleaned = true;
      });

    expect(cleaned).toBe(true);
  });

  it('should use finally even on error', async () => {
    let cleaned = false;

    try {
      await Promise.reject(new Error('Test'))
        .finally(() => {
          cleaned = true;
        });
    } catch (err) {
      expect(cleaned).toBe(true);
    }
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Promise Constructor:
 *    new Promise((resolve, reject) => { ... })
 *    - Call resolve(value) for success
 *    - Call reject(error) for failure
 *    - Only call once!
 *
 * 2. Promise States:
 *    - Pending: Initial state
 *    - Fulfilled: Success (resolved)
 *    - Rejected: Failure
 *    - Once settled, state never changes
 *
 * 3. Consuming Promises:
 *    - .then(onFulfilled, onRejected)
 *    - .catch(onRejected) - same as .then(null, onRejected)
 *    - .finally(onFinally) - cleanup, runs in both cases
 *
 * 4. Promise Methods:
 *    - Promise.resolve(value) - Already resolved
 *    - Promise.reject(error) - Already rejected
 *    - Promise.race([...]) - First to settle wins
 *
 * 5. Common Patterns:
 *    - Delay: setTimeout in promise
 *    - Timeout: Race with timeout promise
 *    - Retry: Recursive promise chain
 *    - Callback conversion: Wrap in promise
 *
 * 6. Best Practices:
 *    - Always handle errors (.catch)
 *    - Use finally for cleanup
 *    - Don't nest promises (use chaining)
 *    - Prefer async/await for readability
 */

import { describe, it, expect } from 'vitest';

/**
 * Exercise 167: Async/Await - SOLUTION
 */

// Helper functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUser(id) {
  return delay(10).then(() => {
    if (id <= 0) throw new Error('Invalid user ID');
    return { id, name: `User${id}`, isAdmin: id === 1 };
  });
}

function fetchPosts(userId) {
  return delay(10).then(() => [
    { id: 1, userId, title: 'Post 1' },
    { id: 2, userId, title: 'Post 2' },
  ]);
}

// Convert promise chain to async/await
export async function getUserWithPosts(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.id);

  return {
    user,
    posts,
  };
}

// Error handling with try/catch
export async function safeGetUser(userId) {
  try {
    const user = await fetchUser(userId);
    return user;
  } catch (err) {
    console.log('Error fetching user:', err.message);
    return null;
  } finally {
    console.log('Fetch attempt completed');
  }
}

// Parallel execution
export async function fetchMultipleUsers(userIds) {
  // All fetch operations start at once
  const promises = userIds.map(id => fetchUser(id));
  const users = await Promise.all(promises);
  return users;
}

// Sequential execution
function processItem(item) {
  return delay(10).then(() => item * 2);
}

export async function processSequentially(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }

  return results;
}

// Retry with async/await
export async function fetchWithRetry(userId, maxRetries) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const user = await fetchUser(userId);
      return user;
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} failed:`, err.message);

      if (attempt < maxRetries) {
        // Exponential backoff
        await delay(Math.pow(2, attempt) * 100);
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Conditional async operations
function fetchAdminData() {
  return delay(10).then(() => ({ permissions: ['all'] }));
}

function fetchRegularData() {
  return delay(10).then(() => ({ permissions: ['read'] }));
}

export async function getConditionalData(userId) {
  const user = await fetchUser(userId);

  let additionalData;
  if (user.isAdmin) {
    additionalData = await fetchAdminData();
  } else {
    additionalData = await fetchRegularData();
  }

  return {
    ...user,
    ...additionalData,
  };
}

// Error recovery
function fetchFromUrl(url) {
  return delay(10).then(() => {
    if (url.includes('fail')) {
      throw new Error('Fetch failed');
    }
    return { data: `Data from ${url}` };
  });
}

export async function fetchWithFallback(primaryUrl, fallbackUrl) {
  try {
    return await fetchFromUrl(primaryUrl);
  } catch (err) {
    console.log('Primary failed, trying fallback');
    try {
      return await fetchFromUrl(fallbackUrl);
    } catch (err2) {
      throw new Error('Both primary and fallback failed');
    }
  }
}

// Async generators
export async function* generateNumbers(count) {
  for (let i = 1; i <= count; i++) {
    await delay(10);
    yield i;
  }
}

// Tests
describe('Exercise 167: Async/Await - Solution', () => {
  it('should fetch user with posts', async () => {
    const data = await getUserWithPosts(1);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(1);
    expect(data.posts).toHaveLength(2);
  });

  it('should handle errors with try/catch', async () => {
    const user = await safeGetUser(-1);
    expect(user).toBeNull();
  });

  it('should return user on success', async () => {
    const user = await safeGetUser(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  it('should fetch multiple users in parallel', async () => {
    const start = Date.now();
    const users = await fetchMultipleUsers([1, 2, 3]);
    const elapsed = Date.now() - start;

    expect(users).toHaveLength(3);
    expect(elapsed).toBeLessThan(50); // Parallel, ~10ms
  });

  it('should process sequentially', async () => {
    const start = Date.now();
    const results = await processSequentially([1, 2, 3]);
    const elapsed = Date.now() - start;

    expect(results).toEqual([2, 4, 6]);
    expect(elapsed).toBeGreaterThanOrEqual(25); // Sequential, ~30ms
  });

  it('should demonstrate parallel vs sequential', async () => {
    const items = [1, 2, 3];

    // Parallel
    const parStart = Date.now();
    await Promise.all(items.map(item => processItem(item)));
    const parTime = Date.now() - parStart;

    // Sequential
    const seqStart = Date.now();
    for (const item of items) {
      await processItem(item);
    }
    const seqTime = Date.now() - seqStart;

    expect(seqTime).toBeGreaterThan(parTime);
  });

  it('should retry on failure', async () => {
    let attempts = 0;

    // Mock fetchUser for this test
    const originalFetch = fetchUser;
    global.mockFetch = (id) => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Temporary failure'));
      }
      return originalFetch(id);
    };

    const retryFn = async (userId, maxRetries) => {
      let lastError;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await global.mockFetch(userId);
        } catch (err) {
          lastError = err;
          if (attempt < maxRetries) {
            await delay(10);
          }
        }
      }
      throw lastError;
    };

    const user = await retryFn(1, 5);
    expect(user).toBeDefined();
    expect(attempts).toBe(3);
  });

  it('should fail after max retries', async () => {
    const alwaysFail = () => Promise.reject(new Error('Always fails'));

    const retryFn = async (maxRetries) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await alwaysFail();
        } catch (err) {
          if (attempt >= maxRetries) throw err;
          await delay(10);
        }
      }
    };

    try {
      await retryFn(3);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toBe('Always fails');
    }
  });

  it('should handle conditional async operations', async () => {
    const adminData = await getConditionalData(1);
    expect(adminData.isAdmin).toBe(true);
    expect(adminData.permissions).toContain('all');

    const userData = await getConditionalData(2);
    expect(userData.isAdmin).toBe(false);
    expect(userData.permissions).toContain('read');
  });

  it('should use fallback on error', async () => {
    const result = await fetchWithFallback(
      'https://api.com/fail',
      'https://api.com/backup'
    );
    expect(result.data).toContain('backup');
  });

  it('should throw if both fail', async () => {
    try {
      await fetchWithFallback(
        'https://api.com/fail',
        'https://api.com/fail2'
      );
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toContain('Both primary and fallback failed');
    }
  });

  it('should iterate async generator', async () => {
    const numbers = [];
    for await (const num of generateNumbers(3)) {
      numbers.push(num);
    }
    expect(numbers).toEqual([1, 2, 3]);
  });

  it('should break async generator early', async () => {
    const numbers = [];
    for await (const num of generateNumbers(10)) {
      numbers.push(num);
      if (num === 3) break;
    }
    expect(numbers).toEqual([1, 2, 3]);
  });

  it('should handle errors in async functions', async () => {
    async function throwError() {
      throw new Error('Async error');
    }

    try {
      await throwError();
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toBe('Async error');
    }
  });

  it('should await in loops correctly', async () => {
    const results = [];

    // WRONG: forEach doesn't wait
    [1, 2, 3].forEach(async (item) => {
      await delay(10);
      results.push(item);
    });
    expect(results).toHaveLength(0); // Empty! forEach doesn't wait

    // RIGHT: for...of waits
    const correctResults = [];
    for (const item of [1, 2, 3]) {
      await delay(10);
      correctResults.push(item);
    }
    expect(correctResults).toEqual([1, 2, 3]);
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Async Function Basics:
 *    - async function always returns a promise
 *    - await pauses execution
 *    - Can only use await inside async function
 *    - Return value is wrapped in Promise.resolve()
 *
 * 2. Error Handling:
 *    - Use try/catch for errors
 *    - finally for cleanup
 *    - Errors bubble up like sync code
 *
 * 3. Parallel vs Sequential:
 *    // Parallel (fast)
 *    await Promise.all([p1, p2, p3]);
 *
 *    // Sequential (slow)
 *    for (const item of items) {
 *      await process(item);
 *    }
 *
 * 4. Common Patterns:
 *    - Retry: loop with try/catch
 *    - Conditional: if/else with await
 *    - Fallback: try/catch with fallback
 *    - Generator: async function*
 *
 * 5. Common Mistakes:
 *    - Using await in forEach (doesn't wait!)
 *    - Sequential when parallel is faster
 *    - Not handling errors
 *    - Forgetting async keyword
 *
 * 6. Best Practices:
 *    - Prefer async/await over .then()
 *    - Use Promise.all for parallel
 *    - Use for...of for sequential
 *    - Always handle errors
 *    - Keep async functions small
 *
 * 7. Advanced Patterns:
 *    - Async generators (async function*)
 *    - for await...of loops
 *    - Concurrent execution control
 *    - Error recovery strategies
 */

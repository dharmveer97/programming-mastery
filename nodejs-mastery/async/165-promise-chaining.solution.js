import { describe, it, expect } from 'vitest';

/**
 * Exercise 165: Promise Chaining - SOLUTION
 */

// Helper functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUser(userId) {
  return delay(10).then(() => {
    if (userId <= 0) throw new Error('Invalid user ID');
    return { id: userId, name: `User${userId}`, isAdmin: userId === 1 };
  });
}

function fetchUserPosts(userId) {
  return delay(10).then(() => {
    return [
      { id: 1, userId, title: 'Post 1' },
      { id: 2, userId, title: 'Post 2' },
    ];
  });
}

function fetchPostComments(postId) {
  return delay(10).then(() => {
    return [
      { id: 1, postId, text: 'Comment 1' },
      { id: 2, postId, text: 'Comment 2' },
    ];
  });
}

// Chain promises - flat, not nested!
export function getUserData(userId) {
  let user;

  return fetchUser(userId)
    .then(fetchedUser => {
      user = fetchedUser;
      return fetchUserPosts(user.id);
    })
    .then(posts => {
      const firstPost = posts[0];
      return fetchPostComments(firstPost.id);
    })
    .then(comments => {
      return {
        user,
        comments,
      };
    });
}

// Transform data through chain
export function processData(input) {
  return Promise.resolve(input)
    .then(x => x * 2)           // 5 * 2 = 10
    .then(x => x + 10)          // 10 + 10 = 20
    .then(x => x * x)           // 20 * 20 = 400
    .then(x => x.toString());   // '400'
}

// Simulate fetch
function fetchData(url) {
  return delay(10).then(() => {
    if (url.includes('fail')) {
      throw new Error('Fetch failed');
    }
    return { data: `Data from ${url}` };
  });
}

// Retry with promise chaining
export function fetchWithRetry(url, maxRetries) {
  let attempts = 0;

  function attempt() {
    attempts++;
    return fetchData(url).catch(err => {
      if (attempts >= maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${err.message}`);
      }
      return delay(100).then(() => attempt());
    });
  }

  return attempt();
}

// Conditional chaining
function fetchAdminData(userId) {
  return delay(10).then(() => ({ admin: true, permissions: ['all'] }));
}

function fetchRegularData(userId) {
  return delay(10).then(() => ({ admin: false, permissions: ['read'] }));
}

export function getDataConditional(userId) {
  return fetchUser(userId)
    .then(user => {
      if (user.isAdmin) {
        return fetchAdminData(user.id);
      }
      return fetchRegularData(user.id);
    });
}

// Fallback pattern
export function fetchWithFallback(primaryUrl, fallbackUrl) {
  return fetchData(primaryUrl)
    .catch(err => {
      console.log('Primary failed, trying fallback');
      return fetchData(fallbackUrl);
    })
    .catch(err => {
      console.log('Fallback failed, using default');
      return { data: 'Default data' };
    });
}

// Fetch multiple users
export function fetchMultipleUsers(userIds) {
  return Promise.all(
    userIds.map(id =>
      fetchUser(id).catch(err => {
        // Handle individual errors
        return { id, error: err.message };
      })
    )
  ).then(users => {
    return users.filter(user => !user.error);
  });
}

// Sequential processing
export function processSequentially(items) {
  // Start with resolved promise
  let chain = Promise.resolve([]);

  items.forEach(item => {
    chain = chain.then(results => {
      // Process one item
      return delay(10)
        .then(() => item * 2)
        .then(result => [...results, result]);
    });
  });

  return chain;
}

// Alternative using reduce
export function processSequentiallyReduce(items) {
  return items.reduce((chain, item) => {
    return chain.then(results =>
      delay(10)
        .then(() => item * 2)
        .then(result => [...results, result])
    );
  }, Promise.resolve([]));
}

// Tests
describe('Exercise 165: Promise Chaining - Solution', () => {
  it('should chain promises to get user data', async () => {
    const data = await getUserData(1);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(1);
    expect(data.comments).toHaveLength(2);
  });

  it('should transform data through chain', async () => {
    const result = await processData(5);
    expect(result).toBe('400'); // (5 * 2 + 10) ^ 2 = 400
  });

  it('should handle errors in chain', async () => {
    try {
      await fetchWithRetry('https://api.com/fail', 3);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toContain('Failed after 3 attempts');
    }
  }, 10000);

  it('should use conditional chaining', async () => {
    const adminData = await getDataConditional(1);
    expect(adminData.admin).toBe(true);
    expect(adminData.permissions).toContain('all');

    const userData = await getDataConditional(2);
    expect(userData.admin).toBe(false);
    expect(userData.permissions).toContain('read');
  });

  it('should use fallback on error', async () => {
    const result = await fetchWithFallback(
      'https://api.com/fail',
      'https://api.com/backup'
    );
    expect(result.data).toBe('Data from https://api.com/backup');
  });

  it('should use default when both fail', async () => {
    const result = await fetchWithFallback(
      'https://api.com/fail',
      'https://api.com/fail2'
    );
    expect(result.data).toBe('Default data');
  });

  it('should fetch multiple users', async () => {
    const users = await fetchMultipleUsers([1, 2, 3]);
    expect(users).toHaveLength(3);
    expect(users[0].name).toBe('User1');
  });

  it('should handle individual user errors', async () => {
    const users = await fetchMultipleUsers([1, -1, 2]);
    expect(users).toHaveLength(2); // -1 filtered out
    expect(users.find(u => u.id === -1)).toBeUndefined();
  });

  it('should process sequentially', async () => {
    const start = Date.now();
    const results = await processSequentially([1, 2, 3]);
    const elapsed = Date.now() - start;

    expect(results).toEqual([2, 4, 6]);
    expect(elapsed).toBeGreaterThanOrEqual(25); // ~30ms sequential
  });

  it('should process sequentially with reduce', async () => {
    const start = Date.now();
    const results = await processSequentiallyReduce([1, 2, 3]);
    const elapsed = Date.now() - start;

    expect(results).toEqual([2, 4, 6]);
    expect(elapsed).toBeGreaterThanOrEqual(25);
  });

  it('should demonstrate difference between sequential and parallel', async () => {
    const items = [1, 2, 3];

    // Sequential
    const seqStart = Date.now();
    await processSequentially(items);
    const seqTime = Date.now() - seqStart;

    // Parallel
    const parStart = Date.now();
    await Promise.all(items.map(item => delay(10).then(() => item * 2)));
    const parTime = Date.now() - parStart;

    expect(seqTime).toBeGreaterThan(parTime);
  });

  it('should handle errors in the middle of chain', async () => {
    const result = await Promise.resolve(10)
      .then(x => x * 2)
      .then(x => {
        if (x > 15) throw new Error('Too big');
        return x;
      })
      .catch(err => {
        // Recover from error
        return 0;
      })
      .then(x => x + 1);

    expect(result).toBe(1); // Error caught, returned 0, then +1
  });

  it('should use finally for cleanup', async () => {
    let cleaned = false;

    await Promise.resolve(42)
      .then(x => x * 2)
      .finally(() => {
        cleaned = true;
      });

    expect(cleaned).toBe(true);
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Flat Chaining:
 *    DON'T nest promises - defeats the purpose!
 *    DO return promises from .then()
 *
 * 2. Return Values:
 *    - Return value: next .then() gets it
 *    - Return promise: next .then() waits for it
 *    - Don't return: next .then() gets undefined
 *
 * 3. Error Handling:
 *    - Errors bubble to next .catch()
 *    - Can recover in .catch() and continue chain
 *    - .catch() in middle of chain handles and continues
 *
 * 4. Conditional Logic:
 *    - Can return different promises based on conditions
 *    - All branches should return promises
 *    - Keep it flat, not nested
 *
 * 5. Sequential vs Parallel:
 *    - Sequential: Chain with .then()
 *    - Parallel: Use Promise.all()
 *    - Choose based on dependencies
 *
 * 6. Common Patterns:
 *    - Save intermediate results in closure
 *    - Use .catch() for fallbacks
 *    - Use .finally() for cleanup
 *    - Reduce for sequential processing
 *
 * 7. Anti-patterns:
 *    - Nesting promises (callback hell 2.0)
 *    - Forgetting to return
 *    - Not handling errors
 *    - Creating unnecessary promises
 */

import { describe, it, expect } from 'vitest';

/**
 * Exercise 167: Async/Await
 *
 * Async/await is syntactic sugar over promises that makes
 * asynchronous code look and behave like synchronous code.
 *
 * ASYNC FUNCTIONS:
 * - Always return a promise
 * - Can use 'await' inside
 * - Automatically wrap return value in Promise.resolve()
 *
 * AWAIT KEYWORD:
 * - Pauses execution until promise settles
 * - Returns the resolved value
 * - Throws if promise rejects
 * - Can only be used inside async functions
 *
 * ERROR HANDLING:
 * - Use try/catch blocks
 * - Much cleaner than .catch()
 * - Can use finally for cleanup
 *
 * BENEFITS:
 * - More readable than .then() chains
 * - Easier debugging (better stack traces)
 * - Simpler error handling
 * - Looks like synchronous code
 *
 * Task: Master async/await patterns
 */

// Helper functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUser(id) {
  return delay(10).then(() => {
    if (id <= 0) throw new Error('Invalid user ID');
    return { id, name: `User${id}` };
  });
}

function fetchPosts(userId) {
  return delay(10).then(() => [
    { id: 1, userId, title: 'Post 1' },
    { id: 2, userId, title: 'Post 2' },
  ]);
}

// TODO: Convert promise chain to async/await
export async function getUserWithPosts(userId) {
  // Your code here
  // 1. Fetch user
  // 2. Fetch posts
  // 3. Return combined data
  // Use async/await instead of .then()
}

// TODO: Handle errors with try/catch
export async function safeGetUser(userId) {
  // Your code here
  // 1. Try to fetch user
  // 2. Catch errors
  // 3. Return null if error
  // 4. Use finally for cleanup logging
}

// TODO: Parallel execution with async/await
export async function fetchMultipleUsers(userIds) {
  // Your code here
  // Fetch all users in parallel
  // Use Promise.all with async/await
  // Return array of users
}

// TODO: Sequential execution with async/await
export async function processSequentially(items) {
  // Your code here
  // Process items one by one
  // Wait for each to complete
  // Return array of results
}

function processItem(item) {
  return delay(10).then(() => item * 2);
}

// TODO: Implement retry with async/await
export async function fetchWithRetry(userId, maxRetries) {
  // Your code here
  // Try to fetch user
  // Retry on failure
  // Use async/await with loops
}

// TODO: Conditional async operations
export async function getConditionalData(userId) {
  // Your code here
  // 1. Fetch user
  // 2. If admin, fetch admin data
  // 3. Otherwise, fetch regular data
  // 4. Return combined result
}

function fetchAdminData() {
  return delay(10).then(() => ({ permissions: ['all'] }));
}

function fetchRegularData() {
  return delay(10).then(() => ({ permissions: ['read'] }));
}

// TODO: Async/await with error recovery
export async function fetchWithFallback(primaryUrl, fallbackUrl) {
  // Your code here
  // Try primary URL
  // If fails, try fallback
  // Return result or throw if both fail
}

function fetchFromUrl(url) {
  return delay(10).then(() => {
    if (url.includes('fail')) {
      throw new Error('Fetch failed');
    }
    return { data: `Data from ${url}` };
  });
}

// TODO: Async generators
export async function* generateNumbers(count) {
  // Your code here
  // Yield numbers with delay
  // Use async generator (async function*)
}

// Tests
describe('Exercise 167: Async/Await', () => {
  it('should fetch user with posts', async () => {
    const data = await getUserWithPosts(1);
    // TODO: Add expectations
  });

  it('should handle errors with try/catch', async () => {
    const user = await safeGetUser(-1);
    // TODO: Add expectations
  });

  it('should fetch multiple users in parallel', async () => {
    const start = Date.now();
    const users = await fetchMultipleUsers([1, 2, 3]);
    const elapsed = Date.now() - start;

    // TODO: Add expectations
    // Should be fast (parallel)
  });

  it('should process sequentially', async () => {
    const start = Date.now();
    const results = await processSequentially([1, 2, 3]);
    const elapsed = Date.now() - start;

    // TODO: Add expectations
    // Should be slow (sequential)
  });

  it('should retry on failure', async () => {
    let attempts = 0;
    const flakeyFetch = (id) => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Temporary failure'));
      }
      return fetchUser(id);
    };

    // TODO: Test with flakey function
  });

  it('should handle conditional async operations', async () => {
    const adminData = await getConditionalData(1); // admin
    const userData = await getConditionalData(2); // regular

    // TODO: Add expectations
  });

  it('should use fallback on error', async () => {
    const result = await fetchWithFallback(
      'https://api.com/fail',
      'https://api.com/backup'
    );

    // TODO: Add expectations
  });

  it('should iterate async generator', async () => {
    const numbers = [];
    for await (const num of generateNumbers(3)) {
      numbers.push(num);
    }

    // TODO: Add expectations
  });
});

/**
 * ASYNC/AWAIT PATTERNS:
 *
 * 1. Basic Usage:
 *    async function foo() {
 *      const result = await promise;
 *      return result;
 *    }
 *
 * 2. Error Handling:
 *    try {
 *      const result = await promise;
 *    } catch (err) {
 *      // handle error
 *    } finally {
 *      // cleanup
 *    }
 *
 * 3. Parallel Execution:
 *    const [a, b, c] = await Promise.all([p1, p2, p3]);
 *
 * 4. Sequential Execution:
 *    for (const item of items) {
 *      await processItem(item);
 *    }
 *
 * 5. Conditional:
 *    const user = await fetchUser(id);
 *    if (user.isAdmin) {
 *      await doAdminStuff();
 *    }
 *
 * COMMON MISTAKES:
 * - Using await in loops (usually want parallel)
 * - Not handling errors (no try/catch)
 * - Forgetting to await
 * - Awaiting in forEach (use for...of)
 *
 * BEST PRACTICES:
 * - Use async/await over .then() chains
 * - Always handle errors
 * - Use Promise.all for parallel operations
 * - Use for...of for sequential loops
 * - Return await only when needed
 */

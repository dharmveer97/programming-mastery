import { describe, it, expect } from 'vitest';

/**
 * Exercise 165: Promise Chaining
 *
 * Promise chaining allows you to perform a sequence of asynchronous
 * operations where each operation starts when the previous one succeeds.
 *
 * BASIC CHAINING:
 * promise
 *   .then(result1 => doSomething(result1))
 *   .then(result2 => doSomethingElse(result2))
 *   .then(result3 => finish(result3))
 *   .catch(error => handleError(error));
 *
 * KEY CONCEPTS:
 * 1. Each .then() returns a new promise
 * 2. Return value becomes next then's input
 * 3. Can return promises or values
 * 4. Errors bubble down to catch
 *
 * BENEFITS:
 * - Avoid callback hell
 * - Flat, readable code
 * - Centralized error handling
 * - Easy to add/remove steps
 *
 * COMMON MISTAKES:
 * - Forgetting to return
 * - Nesting promises (defeats the purpose)
 * - Not handling errors
 *
 * Task: Master promise chaining patterns
 */

// Helper functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: Chain promises to fetch and process user data
export function getUserData(userId) {
  // Your code here
  // 1. Fetch user
  // 2. Fetch user's posts
  // 3. Fetch comments for first post
  // 4. Return combined data
  // Use promise chaining, not nesting!
}

// Simulate API calls
function fetchUser(userId) {
  return delay(10).then(() => {
    if (userId <= 0) throw new Error('Invalid user ID');
    return { id: userId, name: `User${userId}` };
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

// TODO: Transform data through a chain
export function processData(input) {
  // Your code here
  // Chain these transformations:
  // 1. Multiply by 2
  // 2. Add 10
  // 3. Square the result
  // 4. Convert to string
  // Return promise with final result
}

// TODO: Handle errors in chain
export function fetchWithRetry(url, maxRetries) {
  // Your code here
  // 1. Try to fetch
  // 2. If fails, retry
  // 3. Use promise chaining
  // 4. Handle all errors
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

// TODO: Chain with conditional logic
export function getDataConditional(userId) {
  // Your code here
  // 1. Fetch user
  // 2. If user is admin, fetch admin data
  // 3. Otherwise, fetch regular data
  // 4. Return appropriate result
}

// TODO: Recover from errors in chain
export function fetchWithFallback(primaryUrl, fallbackUrl) {
  // Your code here
  // 1. Try primary URL
  // 2. If fails, try fallback URL
  // 3. If both fail, return default value
  // Use .catch() in the middle of chain
}

// TODO: Map array of promises
export function fetchMultipleUsers(userIds) {
  // Your code here
  // 1. Create array of promises
  // 2. Use Promise.all()
  // 3. Transform results
  // 4. Handle errors for individual users
}

// TODO: Sequential processing
export function processSequentially(items) {
  // Your code here
  // Process items one by one (not parallel)
  // Each item takes 10ms to process
  // Use promise chaining
  // Return array of results
}

// Tests
describe('Exercise 165: Promise Chaining', () => {
  it('should chain promises to get user data', async () => {
    const data = await getUserData(1);
    // TODO: Add expectations
  });

  it('should transform data through chain', async () => {
    const result = await processData(5);
    // TODO: Add expectations
    // (5 * 2 + 10) ^ 2 = 400, then '400'
  });

  it('should handle errors in chain', async () => {
    try {
      await fetchWithRetry('https://api.com/fail', 3);
      // TODO: Should not reach here
    } catch (err) {
      // TODO: Add expectations
    }
  });

  it('should use conditional chaining', async () => {
    const adminData = await getDataConditional(1); // admin
    const userData = await getDataConditional(2); // regular user
    // TODO: Add expectations
  });

  it('should use fallback on error', async () => {
    const result = await fetchWithFallback(
      'https://api.com/fail',
      'https://api.com/backup'
    );
    // TODO: Add expectations
  });

  it('should fetch multiple users', async () => {
    const users = await fetchMultipleUsers([1, 2, 3]);
    // TODO: Add expectations
  });

  it('should process sequentially', async () => {
    const start = Date.now();
    const results = await processSequentially([1, 2, 3]);
    const elapsed = Date.now() - start;

    // TODO: Add expectations
    // Should take ~30ms (sequential)
  });
});

/**
 * CHAINING PATTERNS:
 *
 * 1. Linear Chain:
 *    promise
 *      .then(step1)
 *      .then(step2)
 *      .then(step3)
 *
 * 2. Transformation Chain:
 *    promise
 *      .then(x => x * 2)
 *      .then(x => x + 1)
 *      .then(x => x.toString())
 *
 * 3. Conditional Chain:
 *    promise
 *      .then(user => {
 *        if (user.isAdmin) return getAdminData();
 *        return getUserData();
 *      })
 *
 * 4. Error Recovery:
 *    promise
 *      .then(primary)
 *      .catch(err => fallback())
 *      .then(result => process(result))
 *
 * 5. Sequential vs Parallel:
 *    // Sequential
 *    p1().then(r1 => p2()).then(r2 => p3())
 *
 *    // Parallel
 *    Promise.all([p1(), p2(), p3()])
 *
 * BEST PRACTICES:
 * - Always return in .then()
 * - Don't nest promises
 * - Handle errors with .catch()
 * - Use .finally() for cleanup
 * - Prefer async/await for complex chains
 */

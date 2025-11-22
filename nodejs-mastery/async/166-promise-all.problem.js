import { describe, it, expect } from 'vitest';

/**
 * Exercise 166: Promise.all, Promise.race, Promise.allSettled, Promise.any
 *
 * Node.js provides several methods to work with multiple promises:
 *
 * 1. Promise.all([p1, p2, p3])
 *    - Waits for ALL promises to resolve
 *    - Fails FAST if any promise rejects
 *    - Returns array of results in same order
 *    - Use when: All operations must succeed
 *
 * 2. Promise.race([p1, p2, p3])
 *    - Waits for FIRST promise to settle (resolve or reject)
 *    - Returns/throws that first result
 *    - Use when: First response wins (timeout, fastest server)
 *
 * 3. Promise.allSettled([p1, p2, p3])
 *    - Waits for ALL promises to settle
 *    - NEVER rejects
 *    - Returns array with {status, value/reason}
 *    - Use when: Want all results regardless of failures
 *
 * 4. Promise.any([p1, p2, p3])
 *    - Waits for FIRST promise to resolve
 *    - Rejects only if ALL promises reject
 *    - Use when: Need one success (fallback servers)
 *
 * Task: Master concurrent promise patterns
 */

// Helper functions
function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function delayReject(ms, reason) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(reason)), ms));
}

// TODO: Fetch multiple users in parallel
export function fetchAllUsers(userIds) {
  // Your code here
  // Use Promise.all to fetch all users concurrently
  // Return array of user objects
}

// Simulate fetch user
function fetchUser(id) {
  return delay(10, { id, name: `User${id}` });
}

// TODO: Implement timeout race
export function fetchWithTimeout(promise, timeoutMs) {
  // Your code here
  // Use Promise.race
  // Race between promise and timeout
  // Reject if timeout wins
}

// TODO: Fetch from fastest server
export function fetchFromFastest(urls) {
  // Your code here
  // Use Promise.race
  // Try all servers, use fastest response
}

// Simulate fetch from server
function fetchFromServer(url, delay_ms) {
  return delay(delay_ms, { url, data: `Data from ${url}` });
}

// TODO: Fetch with multiple fallbacks
export function fetchWithFallbacks(urls) {
  // Your code here
  // Use Promise.any
  // Try all URLs, use first success
  // Reject only if all fail
}

// TODO: Process all items with partial failures
export function processAllItems(items) {
  // Your code here
  // Use Promise.allSettled
  // Process all items
  // Return both successes and failures
}

// Simulate processing
function processItem(item) {
  if (item < 0) {
    return delayReject(10, `Invalid item: ${item}`);
  }
  return delay(10, item * 2);
}

// TODO: Parallel execution with limit
export function parallelWithLimit(tasks, limit) {
  // Your code here
  // Execute tasks with max concurrency limit
  // Use Promise.all + batching
}

// TODO: Implement map with concurrency
export async function mapWithConcurrency(items, fn, concurrency) {
  // Your code here
  // Map items through async function
  // Control max concurrent operations
  // Return results in order
}

// Tests
describe('Exercise 166: Promise Combinators', () => {
  it('should fetch all users with Promise.all', async () => {
    const users = await fetchAllUsers([1, 2, 3]);
    // TODO: Add expectations
  });

  it('should reject if any user fetch fails', async () => {
    // Simulate failure
    // TODO: Add test
  });

  it('should timeout slow promises', async () => {
    const slowPromise = delay(200, 'done');
    try {
      await fetchWithTimeout(slowPromise, 100);
      // TODO: Should not reach here
    } catch (err) {
      // TODO: Add expectations
    }
  });

  it('should fetch from fastest server', async () => {
    const urls = [
      'https://server1.com',
      'https://server2.com',
      'https://server3.com',
    ];

    const result = await fetchFromFastest(urls);
    // TODO: Add expectations
  });

  it('should use fallback servers with Promise.any', async () => {
    const urls = [
      'https://down1.com',
      'https://down2.com',
      'https://working.com',
    ];

    const result = await fetchWithFallbacks(urls);
    // TODO: Add expectations
  });

  it('should handle all settled promises', async () => {
    const results = await processAllItems([1, -2, 3, -4, 5]);
    // TODO: Add expectations
    // Should have both fulfilled and rejected
  });

  it('should execute tasks with limit', async () => {
    const tasks = Array(10).fill(0).map((_, i) =>
      () => delay(10, i)
    );

    const results = await parallelWithLimit(tasks, 3);
    // TODO: Add expectations
  });

  it('should map with concurrency control', async () => {
    const items = [1, 2, 3, 4, 5];
    const fn = (x) => delay(10, x * 2);

    const results = await mapWithConcurrency(items, fn, 2);
    // TODO: Add expectations
  });
});

/**
 * WHEN TO USE WHAT:
 *
 * Promise.all():
 * - All operations must succeed
 * - Need all results
 * - Fail fast on first error
 * Example: Loading all required data
 *
 * Promise.race():
 * - First result wins
 * - Timeout implementations
 * - Fastest server selection
 * Example: API timeout, primary/backup server
 *
 * Promise.allSettled():
 * - Want all results regardless of success
 * - Need to know which failed
 * - Continue despite failures
 * Example: Batch processing, status dashboard
 *
 * Promise.any():
 * - Need at least one success
 * - Fallback URLs
 * - Fastest successful response
 * Example: CDN fallbacks, multiple data sources
 *
 * PERFORMANCE TIPS:
 * - Use Promise.all for parallel operations
 * - Control concurrency for rate limiting
 * - Consider memory with large batches
 * - Use allSettled for partial failures
 */

import { describe, it, expect } from 'vitest';

/**
 * Exercise 166: Promise.all, Promise.race, Promise.allSettled, Promise.any - SOLUTION
 */

// Helper functions
function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function delayReject(ms, reason) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(reason)), ms));
}

function fetchUser(id) {
  return delay(10, { id, name: `User${id}` });
}

// Promise.all - parallel execution
export function fetchAllUsers(userIds) {
  const promises = userIds.map(id => fetchUser(id));
  return Promise.all(promises);
}

// Promise.race - timeout pattern
export function fetchWithTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

// Promise.race - fastest server
function fetchFromServer(url, delay_ms) {
  return delay(delay_ms, { url, data: `Data from ${url}` });
}

export function fetchFromFastest(urls) {
  const promises = urls.map((url, index) => {
    // Simulate different delays
    const delayMs = (index + 1) * 30;
    return fetchFromServer(url, delayMs);
  });

  return Promise.race(promises);
}

// Promise.any - fallback pattern
export function fetchWithFallbacks(urls) {
  const promises = urls.map((url, index) => {
    if (url.includes('down')) {
      return delayReject(10, `Server ${url} is down`);
    }
    return fetchFromServer(url, 20);
  });

  return Promise.any(promises);
}

// Promise.allSettled - handle partial failures
function processItem(item) {
  if (item < 0) {
    return delayReject(10, `Invalid item: ${item}`);
  }
  return delay(10, item * 2);
}

export function processAllItems(items) {
  const promises = items.map(item => processItem(item));
  return Promise.allSettled(promises);
}

// Parallel with concurrency limit
export async function parallelWithLimit(tasks, limit) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });

    results.push(promise);
    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// Map with concurrency control
export async function mapWithConcurrency(items, fn, concurrency) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const promise = fn(item).then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });

    results.push(promise);
    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// Tests
describe('Exercise 166: Promise Combinators - Solution', () => {
  it('should fetch all users with Promise.all', async () => {
    const users = await fetchAllUsers([1, 2, 3]);
    expect(users).toHaveLength(3);
    expect(users[0].id).toBe(1);
    expect(users[1].id).toBe(2);
    expect(users[2].id).toBe(3);
  });

  it('should reject if any user fetch fails', async () => {
    const fetchUserWithError = (id) => {
      if (id === 2) {
        return delayReject(10, 'User not found');
      }
      return fetchUser(id);
    };

    const promises = [1, 2, 3].map(id => fetchUserWithError(id));

    try {
      await Promise.all(promises);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toBe('User not found');
    }
  });

  it('should timeout slow promises', async () => {
    const slowPromise = delay(200, 'done');

    try {
      await fetchWithTimeout(slowPromise, 100);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toContain('Timeout');
    }
  });

  it('should not timeout fast promises', async () => {
    const fastPromise = delay(50, 'done');
    const result = await fetchWithTimeout(fastPromise, 100);
    expect(result).toBe('done');
  });

  it('should fetch from fastest server', async () => {
    const urls = [
      'https://server1.com',
      'https://server2.com',
      'https://server3.com',
    ];

    const result = await fetchFromFastest(urls);
    expect(result.url).toBe('https://server1.com'); // Fastest
    expect(result.data).toContain('server1.com');
  });

  it('should use fallback servers with Promise.any', async () => {
    const urls = [
      'https://down1.com',
      'https://down2.com',
      'https://working.com',
    ];

    const result = await fetchWithFallbacks(urls);
    expect(result.url).toBe('https://working.com');
  });

  it('should reject if all promises fail with Promise.any', async () => {
    const urls = [
      'https://down1.com',
      'https://down2.com',
      'https://down3.com',
    ];

    try {
      await fetchWithFallbacks(urls);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AggregateError);
    }
  });

  it('should handle all settled promises', async () => {
    const results = await processAllItems([1, -2, 3, -4, 5]);

    expect(results).toHaveLength(5);

    // Check fulfilled promises
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    expect(fulfilled).toHaveLength(3);
    expect(fulfilled[0].value).toBe(2);  // 1 * 2
    expect(fulfilled[1].value).toBe(6);  // 3 * 2
    expect(fulfilled[2].value).toBe(10); // 5 * 2

    // Check rejected promises
    const rejected = results.filter(r => r.status === 'rejected');
    expect(rejected).toHaveLength(2);
    expect(rejected[0].reason.message).toContain('Invalid item: -2');
    expect(rejected[1].reason.message).toContain('Invalid item: -4');
  });

  it('should execute tasks with limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const tasks = Array(10).fill(0).map((_, i) => () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      return delay(20, i).then(result => {
        concurrent--;
        return result;
      });
    });

    const results = await parallelWithLimit(tasks, 3);

    expect(results).toHaveLength(10);
    expect(maxConcurrent).toBeLessThanOrEqual(3);
    expect(maxConcurrent).toBeGreaterThan(0);
  });

  it('should map with concurrency control', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const items = [1, 2, 3, 4, 5];
    const fn = (x) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      return delay(20, x * 2).then(result => {
        concurrent--;
        return result;
      });
    };

    const results = await mapWithConcurrency(items, fn, 2);

    expect(results).toEqual([2, 4, 6, 8, 10]);
    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  it('should demonstrate Promise.all vs sequential', async () => {
    const items = [1, 2, 3];

    // Sequential
    const seqStart = Date.now();
    const seqResults = [];
    for (const item of items) {
      seqResults.push(await delay(30, item));
    }
    const seqTime = Date.now() - seqStart;

    // Parallel
    const parStart = Date.now();
    const parResults = await Promise.all(
      items.map(item => delay(30, item))
    );
    const parTime = Date.now() - parStart;

    expect(seqResults).toEqual([1, 2, 3]);
    expect(parResults).toEqual([1, 2, 3]);
    expect(seqTime).toBeGreaterThan(80); // ~90ms
    expect(parTime).toBeLessThan(50);   // ~30ms
  });

  it('should compare all promise combinators', async () => {
    const fast = delay(10, 'fast');
    const slow = delay(100, 'slow');
    const fail = delayReject(20, 'error');

    // Promise.all - waits for all, fails fast
    try {
      await Promise.all([fast, fail, slow]);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toBe('error');
    }

    // Promise.race - first to settle
    const raceResult = await Promise.race([fast, slow]);
    expect(raceResult).toBe('fast');

    // Promise.allSettled - all results
    const settledResults = await Promise.allSettled([
      fast,
      delayReject(10, 'err'),
      slow
    ]);
    expect(settledResults).toHaveLength(3);
    expect(settledResults[0].status).toBe('fulfilled');
    expect(settledResults[1].status).toBe('rejected');

    // Promise.any - first success
    const anyResult = await Promise.any([
      delayReject(10, 'err1'),
      delay(30, 'success'),
      slow
    ]);
    expect(anyResult).toBe('success');
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Promise.all():
 *    - Parallel execution
 *    - Fast failure (first error stops all)
 *    - Results in same order as input
 *    - Use when: All must succeed
 *
 * 2. Promise.race():
 *    - First to settle wins
 *    - Can be resolve or reject
 *    - Use for: Timeouts, fastest response
 *
 * 3. Promise.allSettled():
 *    - Waits for all, never rejects
 *    - Returns status + value/reason
 *    - Use when: Want all results despite failures
 *
 * 4. Promise.any():
 *    - First to resolve wins
 *    - Ignores rejections until all fail
 *    - Returns AggregateError if all fail
 *    - Use for: Fallback URLs, multiple sources
 *
 * 5. Concurrency Control:
 *    - Use Promise.race to limit concurrent operations
 *    - Track executing promises
 *    - Remove from tracking when complete
 *    - Wait when limit reached
 *
 * 6. Performance:
 *    - Promise.all is much faster than sequential
 *    - Control concurrency for rate limiting
 *    - Use allSettled for partial failures
 *    - Consider memory with large batches
 *
 * 7. Error Handling:
 *    - Promise.all: One error stops all
 *    - Promise.allSettled: No errors, all settle
 *    - Promise.any: Only fails if all fail
 *    - Always handle rejections
 */

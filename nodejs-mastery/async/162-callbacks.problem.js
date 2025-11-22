import { describe, it, expect } from 'vitest';

/**
 * Exercise 162: Callbacks and Error-First Callbacks
 *
 * Callbacks are the foundation of asynchronous programming in Node.js.
 *
 * ERROR-FIRST CALLBACK PATTERN:
 * - First parameter is always error (null if no error)
 * - Subsequent parameters are the results
 * - Standard convention: callback(err, result)
 *
 * BENEFITS:
 * - Consistent error handling
 * - Clear success/failure paths
 * - Standard across Node.js ecosystem
 *
 * COMMON PITFALLS:
 * - Forgetting to check for errors
 * - Calling callback multiple times
 * - Not returning after callback
 * - Mixing sync and async execution
 *
 * Task: Implement proper callback patterns with error handling
 */

// TODO: Implement a simple async function with error-first callback
export function fetchUser(userId, callback) {
  // Your code here
  // 1. Validate userId (should be a number > 0)
  // 2. If invalid, call callback with error
  // 3. Otherwise, simulate async fetch and return user
  // Remember: callback(error, result)
}

// TODO: Implement reading multiple files with callbacks
export function readMultipleFiles(filenames, callback) {
  // Your code here
  // 1. Read each file using a callback pattern
  // 2. Collect all results
  // 3. Call final callback with all contents
  // Handle errors properly
}

// TODO: Implement a function that ensures callback is always async
export function alwaysAsync(value, callback) {
  // Your code here
  // Problem: Sometimes sync, sometimes async is BAD
  // Solution: Always use process.nextTick or setTimeout
}

// TODO: Implement callback that's called only once
export function callOnce(operation, callback) {
  // Your code here
  // Ensure callback is never called more than once
  // Even if operation calls it multiple times
}

// TODO: Implement timeout wrapper for callbacks
export function withTimeout(fn, timeout, callback) {
  // Your code here
  // Call fn, but timeout if it takes too long
  // Ensure callback is called exactly once
}

// TODO: Implement parallel execution with callbacks
export function parallel(tasks, callback) {
  // Your code here
  // tasks: array of functions that take callbacks
  // Execute all in parallel
  // Call final callback when all complete
  // Format: callback(err, results)
}

// Tests
describe('Exercise 162: Callbacks', () => {
  it('should implement error-first callback pattern', (done) => {
    fetchUser(1, (err, user) => {
      // TODO: Add expectations
      done();
    });
  });

  it('should handle invalid input with error', (done) => {
    fetchUser(-1, (err, user) => {
      // TODO: Add expectations
      done();
    });
  });

  it('should read multiple files', (done) => {
    const files = ['file1.txt', 'file2.txt'];
    readMultipleFiles(files, (err, contents) => {
      // TODO: Add expectations
      done();
    });
  });

  it('should always be async', (done) => {
    let sync = true;
    alwaysAsync('test', (err, result) => {
      // TODO: Add expectations
      done();
    });
    sync = false;
  });

  it('should call callback only once', (done) => {
    let callCount = 0;
    const operation = (cb) => {
      cb(null, 'first');
      cb(null, 'second');
    };

    callOnce(operation, (err, result) => {
      callCount++;
      // TODO: Add expectations
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 10);
    });
  });

  it('should timeout slow operations', (done) => {
    const slowFn = (cb) => {
      setTimeout(() => cb(null, 'done'), 200);
    };

    withTimeout(slowFn, 100, (err, result) => {
      // TODO: Add expectations for timeout
      done();
    });
  });

  it('should execute tasks in parallel', (done) => {
    const tasks = [
      (cb) => setTimeout(() => cb(null, 1), 50),
      (cb) => setTimeout(() => cb(null, 2), 30),
      (cb) => setTimeout(() => cb(null, 3), 10),
    ];

    parallel(tasks, (err, results) => {
      // TODO: Add expectations
      done();
    });
  });
});

/**
 * BEST PRACTICES:
 *
 * 1. Always check for errors first:
 *    if (err) return callback(err);
 *
 * 2. Always return after calling callback:
 *    return callback(null, result);
 *
 * 3. Make callbacks consistently async:
 *    Use process.nextTick() or setImmediate()
 *
 * 4. Never call callback multiple times:
 *    Use guards or wrapper functions
 *
 * 5. Handle both sync and async errors:
 *    try-catch for sync, callback for async
 *
 * COMMON MISTAKES:
 * - Not returning after callback
 * - Mixing sync and async execution
 * - Swallowing errors
 * - Callback hell (see next exercise)
 */

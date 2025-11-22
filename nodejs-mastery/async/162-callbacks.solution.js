import { describe, it, expect } from 'vitest';

/**
 * Exercise 162: Callbacks and Error-First Callbacks - SOLUTION
 */

// Simulate a database of users
const users = {
  1: { id: 1, name: 'Alice', email: 'alice@example.com' },
  2: { id: 2, name: 'Bob', email: 'bob@example.com' },
  3: { id: 3, name: 'Charlie', email: 'charlie@example.com' },
};

export function fetchUser(userId, callback) {
  // Validate input
  if (!userId || typeof userId !== 'number' || userId <= 0) {
    // Use process.nextTick to ensure callback is always async
    return process.nextTick(() => {
      callback(new Error('Invalid userId: must be a positive number'));
    });
  }

  // Simulate async database fetch
  setTimeout(() => {
    const user = users[userId];
    if (!user) {
      return callback(new Error(`User ${userId} not found`));
    }
    callback(null, user);
  }, 10);
}

export function readMultipleFiles(filenames, callback) {
  const contents = [];
  let completed = 0;
  let hasError = false;

  if (!filenames || filenames.length === 0) {
    return process.nextTick(() => {
      callback(new Error('No files provided'));
    });
  }

  filenames.forEach((filename, index) => {
    // Simulate file read
    setTimeout(() => {
      if (hasError) return; // Don't process if we already errored

      if (!filename) {
        hasError = true;
        return callback(new Error('Invalid filename'));
      }

      contents[index] = `Content of ${filename}`;
      completed++;

      if (completed === filenames.length) {
        callback(null, contents);
      }
    }, Math.random() * 50);
  });
}

export function alwaysAsync(value, callback) {
  // BAD: Sometimes sync, sometimes async
  // if (value) {
  //   callback(null, value);
  // } else {
  //   setTimeout(() => callback(new Error('No value')), 0);
  // }

  // GOOD: Always async using process.nextTick
  process.nextTick(() => {
    if (value) {
      callback(null, value);
    } else {
      callback(new Error('No value'));
    }
  });
}

export function callOnce(operation, callback) {
  let called = false;

  const onceCallback = (err, result) => {
    if (called) return; // Ignore subsequent calls
    called = true;
    callback(err, result);
  };

  operation(onceCallback);
}

export function withTimeout(fn, timeout, callback) {
  let called = false;
  let timeoutId;

  const onceCallback = (err, result) => {
    if (called) return;
    called = true;
    clearTimeout(timeoutId);
    callback(err, result);
  };

  // Set timeout
  timeoutId = setTimeout(() => {
    onceCallback(new Error(`Operation timed out after ${timeout}ms`));
  }, timeout);

  // Execute function
  try {
    fn(onceCallback);
  } catch (err) {
    onceCallback(err);
  }
}

export function parallel(tasks, callback) {
  const results = [];
  let completed = 0;
  let hasError = false;

  if (!tasks || tasks.length === 0) {
    return process.nextTick(() => {
      callback(null, []);
    });
  }

  tasks.forEach((task, index) => {
    task((err, result) => {
      if (hasError) return; // Already called back with error

      if (err) {
        hasError = true;
        return callback(err);
      }

      results[index] = result;
      completed++;

      if (completed === tasks.length) {
        callback(null, results);
      }
    });
  });
}

// Tests
describe('Exercise 162: Callbacks - Solution', () => {
  it('should implement error-first callback pattern', (done) => {
    fetchUser(1, (err, user) => {
      expect(err).toBeNull();
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.name).toBe('Alice');
      done();
    });
  });

  it('should handle invalid input with error', (done) => {
    fetchUser(-1, (err, user) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('Invalid userId');
      expect(user).toBeUndefined();
      done();
    });
  });

  it('should handle user not found', (done) => {
    fetchUser(999, (err, user) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('not found');
      done();
    });
  });

  it('should read multiple files', (done) => {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];
    readMultipleFiles(files, (err, contents) => {
      expect(err).toBeNull();
      expect(contents).toHaveLength(3);
      expect(contents[0]).toContain('file1.txt');
      done();
    });
  });

  it('should always be async', (done) => {
    let sync = true;
    alwaysAsync('test', (err, result) => {
      expect(sync).toBe(false); // Should be async
      expect(err).toBeNull();
      expect(result).toBe('test');
      done();
    });
    sync = false;
  });

  it('should call callback only once', (done) => {
    let callCount = 0;
    const operation = (cb) => {
      cb(null, 'first');
      cb(null, 'second');
      cb(null, 'third');
    };

    callOnce(operation, (err, result) => {
      callCount++;
      expect(result).toBe('first');
    });

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 10);
  });

  it('should timeout slow operations', (done) => {
    const slowFn = (cb) => {
      setTimeout(() => cb(null, 'done'), 200);
    };

    withTimeout(slowFn, 100, (err, result) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('timed out');
      expect(result).toBeUndefined();
      done();
    });
  });

  it('should not timeout fast operations', (done) => {
    const fastFn = (cb) => {
      setTimeout(() => cb(null, 'done'), 10);
    };

    withTimeout(fastFn, 100, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBe('done');
      done();
    });
  });

  it('should execute tasks in parallel', (done) => {
    const start = Date.now();
    const tasks = [
      (cb) => setTimeout(() => cb(null, 1), 50),
      (cb) => setTimeout(() => cb(null, 2), 30),
      (cb) => setTimeout(() => cb(null, 3), 10),
    ];

    parallel(tasks, (err, results) => {
      const elapsed = Date.now() - start;
      expect(err).toBeNull();
      expect(results).toEqual([1, 2, 3]);
      expect(elapsed).toBeLessThan(100); // Should run in parallel
      done();
    });
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Error-First Pattern:
 *    Always use callback(err, result)
 *    Check errors first: if (err) return callback(err);
 *
 * 2. Consistency:
 *    Always async or always sync, never mixed
 *    Use process.nextTick() to ensure async
 *
 * 3. Guard Against Multiple Calls:
 *    Use a flag to track if callback was called
 *    Return early if already called
 *
 * 4. Timeout Pattern:
 *    Set timeout before executing operation
 *    Clear timeout on success
 *    Ensure callback called exactly once
 *
 * 5. Parallel Execution:
 *    Track completion count
 *    Store results by index
 *    Handle errors with guard flag
 */

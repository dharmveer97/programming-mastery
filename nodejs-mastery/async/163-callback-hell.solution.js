import { describe, it, expect } from 'vitest';

/**
 * Exercise 163: Callback Hell and Solutions - SOLUTION
 */

// Simulate async operations
function getUser(userId, callback) {
  setTimeout(() => {
    if (userId <= 0) return callback(new Error('Invalid user ID'));
    callback(null, { id: userId, name: `User${userId}` });
  }, 10);
}

function getUserPosts(userId, callback) {
  setTimeout(() => {
    callback(null, [
      { id: 1, userId, title: 'Post 1' },
      { id: 2, userId, title: 'Post 2' },
    ]);
  }, 10);
}

function getPostComments(postId, callback) {
  setTimeout(() => {
    callback(null, [
      { id: 1, postId, text: 'Comment 1' },
      { id: 2, postId, text: 'Comment 2' },
    ]);
  }, 10);
}

function getCommentLikes(commentId, callback) {
  setTimeout(() => {
    callback(null, { commentId, likes: 42 });
  }, 10);
}

// BAD: Callback hell
export function getUserDataNested(userId, callback) {
  getUser(userId, (err, user) => {
    if (err) return callback(err);
    getUserPosts(user.id, (err, posts) => {
      if (err) return callback(err);
      const firstPost = posts[0];
      getPostComments(firstPost.id, (err, comments) => {
        if (err) return callback(err);
        const firstComment = comments[0];
        getCommentLikes(firstComment.id, (err, likes) => {
          if (err) return callback(err);
          callback(null, { user, posts, comments, likes });
        });
      });
    });
  });
}

// GOOD: Flattened with named functions
export function getUserDataFlat(userId, callback) {
  let userData = {};

  function handleUser(err, user) {
    if (err) return callback(err);
    userData.user = user;
    getUserPosts(user.id, handlePosts);
  }

  function handlePosts(err, posts) {
    if (err) return callback(err);
    userData.posts = posts;
    const firstPost = posts[0];
    if (!firstPost) return callback(new Error('No posts found'));
    getPostComments(firstPost.id, handleComments);
  }

  function handleComments(err, comments) {
    if (err) return callback(err);
    userData.comments = comments;
    const firstComment = comments[0];
    if (!firstComment) return callback(new Error('No comments found'));
    getCommentLikes(firstComment.id, handleLikes);
  }

  function handleLikes(err, likes) {
    if (err) return callback(err);
    userData.likes = likes;
    callback(null, userData);
  }

  getUser(userId, handleUser);
}

// Series: Execute tasks in sequence
export function series(tasks, callback) {
  const results = [];
  let index = 0;

  function next() {
    if (index >= tasks.length) {
      return callback(null, results);
    }

    const task = tasks[index];
    index++;

    task((err, result) => {
      if (err) return callback(err);
      results.push(result);
      next();
    });
  }

  next();
}

// Waterfall: Pass results from one task to next
export function waterfall(tasks, callback) {
  let index = 0;

  function next(...args) {
    if (index >= tasks.length) {
      return callback(null, ...args);
    }

    const task = tasks[index];
    index++;

    // First task gets no arguments, rest get previous results
    const taskArgs = index === 1 ? [handleResult] : [...args, handleResult];

    function handleResult(err, ...results) {
      if (err) return callback(err);
      next(...results);
    }

    task(...taskArgs);
  }

  next();
}

// Retry pattern
export function getUserWithRetry(userId, maxRetries, callback) {
  let attempts = 0;

  function attempt() {
    attempts++;
    getUser(userId, (err, user) => {
      if (!err) {
        return callback(null, user);
      }

      if (attempts >= maxRetries) {
        return callback(new Error(`Failed after ${maxRetries} attempts: ${err.message}`));
      }

      // Exponential backoff
      const delay = Math.pow(2, attempts) * 100;
      setTimeout(attempt, delay);
    });
  }

  attempt();
}

// Parallel with concurrency limit
export function parallelLimit(tasks, limit, callback) {
  const results = [];
  let running = 0;
  let completed = 0;
  let index = 0;
  let hasError = false;

  function next() {
    if (hasError) return;

    while (running < limit && index < tasks.length) {
      const currentIndex = index;
      const task = tasks[index];
      index++;
      running++;

      task((err, result) => {
        running--;
        completed++;

        if (hasError) return;

        if (err) {
          hasError = true;
          return callback(err);
        }

        results[currentIndex] = result;

        if (completed === tasks.length) {
          callback(null, results);
        } else {
          next();
        }
      });
    }
  }

  if (tasks.length === 0) {
    return process.nextTick(() => callback(null, []));
  }

  next();
}

// Tests
describe('Exercise 163: Callback Hell - Solution', () => {
  it('should execute nested callbacks', (done) => {
    getUserDataNested(1, (err, data) => {
      expect(err).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.posts).toHaveLength(2);
      expect(data.comments).toHaveLength(2);
      expect(data.likes.likes).toBe(42);
      done();
    });
  });

  it('should execute flat callbacks', (done) => {
    getUserDataFlat(1, (err, data) => {
      expect(err).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.posts).toHaveLength(2);
      expect(data.comments).toHaveLength(2);
      expect(data.likes.likes).toBe(42);
      done();
    });
  });

  it('should execute tasks in series', (done) => {
    const order = [];
    const tasks = [
      (cb) => setTimeout(() => { order.push(1); cb(null, 1); }, 30),
      (cb) => setTimeout(() => { order.push(2); cb(null, 2); }, 20),
      (cb) => setTimeout(() => { order.push(3); cb(null, 3); }, 10),
    ];

    series(tasks, (err, results) => {
      expect(err).toBeNull();
      expect(results).toEqual([1, 2, 3]);
      expect(order).toEqual([1, 2, 3]); // Sequential!
      done();
    });
  });

  it('should handle series errors', (done) => {
    const tasks = [
      (cb) => cb(null, 1),
      (cb) => cb(new Error('Task failed')),
      (cb) => cb(null, 3),
    ];

    series(tasks, (err, results) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Task failed');
      done();
    });
  });

  it('should execute waterfall', (done) => {
    const tasks = [
      (cb) => cb(null, 1),
      (result, cb) => cb(null, result + 1),
      (result, cb) => cb(null, result * 2),
    ];

    waterfall(tasks, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBe(4); // (1 + 1) * 2
      done();
    });
  });

  it('should handle waterfall errors', (done) => {
    const tasks = [
      (cb) => cb(null, 1),
      (result, cb) => cb(new Error('Failed')),
      (result, cb) => cb(null, result * 2),
    ];

    waterfall(tasks, (err, result) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Failed');
      done();
    });
  });

  it('should retry failed operations', (done) => {
    let attempts = 0;

    // Override getUser for this test
    const originalGetUser = getUser;
    global.getUser = (id, cb) => {
      attempts++;
      if (attempts < 3) {
        return cb(new Error('Temporary failure'));
      }
      cb(null, { id, name: 'User' });
    };

    getUserWithRetry(1, 5, (err, user) => {
      expect(err).toBeNull();
      expect(user).toBeDefined();
      expect(attempts).toBe(3);
      global.getUser = originalGetUser;
      done();
    });
  }, 10000);

  it('should fail after max retries', (done) => {
    const alwaysFail = (id, cb) => {
      cb(new Error('Always fails'));
    };

    const retryFn = (userId, maxRetries, callback) => {
      let attempts = 0;
      function attempt() {
        attempts++;
        alwaysFail(userId, (err, user) => {
          if (!err) return callback(null, user);
          if (attempts >= maxRetries) {
            return callback(new Error(`Failed after ${maxRetries} attempts: ${err.message}`));
          }
          setTimeout(attempt, 10);
        });
      }
      attempt();
    };

    retryFn(1, 3, (err, user) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('Failed after 3 attempts');
      done();
    });
  });

  it('should limit parallel execution', (done) => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const tasks = Array(10).fill(0).map((_, i) => (cb) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      setTimeout(() => {
        concurrent--;
        cb(null, i);
      }, 50);
    });

    parallelLimit(tasks, 3, (err, results) => {
      expect(err).toBeNull();
      expect(results).toHaveLength(10);
      expect(maxConcurrent).toBeLessThanOrEqual(3);
      expect(maxConcurrent).toBeGreaterThan(0);
      done();
    });
  }, 10000);
});

/**
 * KEY LEARNINGS:
 *
 * 1. Named Functions:
 *    - Break nested callbacks into named functions
 *    - Each function handles one step
 *    - Easier to read and debug
 *
 * 2. Control Flow Patterns:
 *    - Series: Execute one after another
 *    - Waterfall: Pass results between tasks
 *    - Parallel: Execute simultaneously
 *    - ParallelLimit: Control concurrency
 *
 * 3. Error Handling:
 *    - Check errors at each step
 *    - Return immediately on error
 *    - Don't continue processing after error
 *
 * 4. Retry Pattern:
 *    - Track attempt count
 *    - Exponential backoff
 *    - Maximum retry limit
 *
 * 5. Concurrency Control:
 *    - Track running tasks
 *    - Start new tasks as others complete
 *    - Respect the limit
 */

import { describe, it, expect } from 'vitest';

/**
 * Exercise 163: Callback Hell and Solutions
 *
 * CALLBACK HELL (Pyramid of Doom):
 * - Deeply nested callbacks
 * - Hard to read and maintain
 * - Difficult error handling
 * - Poor code structure
 *
 * EXAMPLE OF CALLBACK HELL:
 * getData(function(a) {
 *   getMoreData(a, function(b) {
 *     getMoreData(b, function(c) {
 *       getMoreData(c, function(d) {
 *         // ... more nesting
 *       });
 *     });
 *   });
 * });
 *
 * SOLUTIONS:
 * 1. Named functions (break into smaller functions)
 * 2. Modularization (separate concerns)
 * 3. Control flow libraries (async.js)
 * 4. Promises (next exercises)
 * 5. Async/await (even better!)
 *
 * Task: Refactor callback hell into cleaner code
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

// TODO: This is callback hell! Refactor it using named functions
export function getUserDataNested(userId, callback) {
  // BAD: Deeply nested callbacks
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
          callback(null, {
            user,
            posts,
            comments,
            likes,
          });
        });
      });
    });
  });
}

// TODO: Refactor using named functions
export function getUserDataFlat(userId, callback) {
  // Your code here
  // Break the nested callbacks into named functions
  // Make it flat and readable
}

// TODO: Implement sequential execution helper
export function series(tasks, callback) {
  // Your code here
  // Execute tasks in sequence
  // tasks: array of functions like (cb) => {...}
  // Collect all results
  // Call callback(err, results)
}

// TODO: Implement waterfall helper
export function waterfall(tasks, callback) {
  // Your code here
  // Execute tasks in sequence
  // Pass result of each task to next
  // Like: task1 -> task2(result1) -> task3(result2)
}

// TODO: Implement better error handling pattern
export function getUserWithRetry(userId, maxRetries, callback) {
  // Your code here
  // Retry failed operations
  // Track attempt count
  // Give up after maxRetries
}

// TODO: Implement parallel execution with limit
export function parallelLimit(tasks, limit, callback) {
  // Your code here
  // Execute tasks in parallel
  // But only 'limit' at a time
  // Useful for rate limiting
}

// Tests
describe('Exercise 163: Callback Hell', () => {
  it('should execute nested callbacks', (done) => {
    getUserDataNested(1, (err, data) => {
      // TODO: Add expectations
      done();
    });
  });

  it('should execute flat callbacks', (done) => {
    getUserDataFlat(1, (err, data) => {
      // TODO: Add expectations
      done();
    });
  });

  it('should execute tasks in series', (done) => {
    const tasks = [
      (cb) => setTimeout(() => cb(null, 1), 30),
      (cb) => setTimeout(() => cb(null, 2), 20),
      (cb) => setTimeout(() => cb(null, 3), 10),
    ];

    series(tasks, (err, results) => {
      // TODO: Add expectations
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
      // TODO: Add expectations
      // (1 + 1) * 2 = 4
      done();
    });
  });

  it('should retry failed operations', (done) => {
    let attempts = 0;
    const flakeyGetUser = (id, cb) => {
      attempts++;
      if (attempts < 3) {
        return cb(new Error('Temporary failure'));
      }
      cb(null, { id, name: 'User' });
    };

    // TODO: Test retry logic
    done();
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
      }, 10);
    });

    parallelLimit(tasks, 3, (err, results) => {
      // TODO: Add expectations
      // maxConcurrent should be <= 3
      done();
    });
  });
});

/**
 * PATTERNS TO AVOID CALLBACK HELL:
 *
 * 1. Keep code shallow:
 *    - Use named functions
 *    - Early returns
 *    - Break into modules
 *
 * 2. Handle errors consistently:
 *    - Check errors first
 *    - Return after error callback
 *    - Don't let errors disappear
 *
 * 3. Use helper functions:
 *    - series, parallel, waterfall
 *    - async.js library
 *    - Custom utilities
 *
 * 4. Consider alternatives:
 *    - Promises (better!)
 *    - Async/await (best!)
 *    - Generators
 *
 * WHEN TO USE WHAT:
 * - Simple tasks: plain callbacks
 * - Complex flows: promises/async-await
 * - Legacy code: refactor gradually
 */

import { describe, it, expect } from 'vitest';

/**
 * Exercise 77: async/await Basics
 *
 * async/await is syntactic sugar for working with Promises.
 * Makes asynchronous code look synchronous.
 *
 * Key points:
 * - async keyword defines an async function
 * - await pauses execution until promise resolves
 * - async functions always return a Promise
 * - Can only use await inside async functions
 *
 * Task: Convert promise chains to async/await
 */

// Helper function (provided)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: Create async function that waits for delay then returns value
export async function delayedValue(value, ms) {
  // Your code here
}

// TODO: Fetch multiple users sequentially and return array
// Use this mock function: fetchUser(id)
function fetchUser(id) {
  return Promise.resolve({ id, name: `User${id}` });
}

export async function fetchMultipleUsers(ids) {
  // Your code here
}

// TODO: Calculate total after async operations
// 1. Get value after 50ms
// 2. Double it
// 3. Add 10
export async function calculateAsync(initialValue) {
  // Your code here
}

// TODO: Fetch user and their posts
// Return: { user: {...}, posts: [...] }
function fetchUserData(userId) {
  return Promise.resolve({ id: userId, name: `User${userId}` });
}

function fetchUserPosts(userId) {
  return Promise.resolve([
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' }
  ]);
}

export async function getUserWithPosts(userId) {
  // Your code here
}

// Tests
describe('Exercise 77: async/await Basics', () => {
  it('should return delayed value', async () => {
    const result = await delayedValue('hello', 100);
    expect(result).toBe('hello');
  });

  it('should fetch multiple users', async () => {
    const users = await fetchMultipleUsers([1, 2, 3]);
    expect(users).toEqual([
      { id: 1, name: 'User1' },
      { id: 2, name: 'User2' },
      { id: 3, name: 'User3' }
    ]);
  });

  it('should calculate async result', async () => {
    const result = await calculateAsync(5);
    // (5 * 2) + 10 = 20
    expect(result).toBe(20);
  });

  it('should fetch user with posts', async () => {
    const result = await getUserWithPosts(1);
    expect(result).toEqual({
      user: { id: 1, name: 'User1' },
      posts: [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ]
    });
  });
});

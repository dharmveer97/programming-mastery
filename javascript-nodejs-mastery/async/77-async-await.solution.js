import { describe, it, expect } from 'vitest';

/**
 * Exercise 77: async/await Basics - SOLUTION
 */

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function delayedValue(value, ms) {
  await delay(ms);
  return value;
}

function fetchUser(id) {
  return Promise.resolve({ id, name: `User${id}` });
}

export async function fetchMultipleUsers(ids) {
  const users = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    users.push(user);
  }
  return users;

  // Alternative using Promise.all (parallel):
  // return Promise.all(ids.map(id => fetchUser(id)));
}

export async function calculateAsync(initialValue) {
  await delay(50);
  const doubled = initialValue * 2;
  const result = doubled + 10;
  return result;
}

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
  const user = await fetchUserData(userId);
  const posts = await fetchUserPosts(userId);
  return { user, posts };

  // Alternative (parallel):
  // const [user, posts] = await Promise.all([
  //   fetchUserData(userId),
  //   fetchUserPosts(userId)
  // ]);
  // return { user, posts };
}

// Tests
describe('Exercise 77: async/await Basics - Solution', () => {
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

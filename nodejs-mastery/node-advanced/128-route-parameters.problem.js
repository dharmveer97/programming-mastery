import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 128: Route Parameters & Query Strings
 *
 * Express allows you to capture dynamic values from URLs:
 * - Route parameters: /users/:id
 * - Query strings: /search?q=term
 *
 * Access via:
 * - req.params for route parameters
 * - req.query for query strings
 *
 * Task: Create routes with parameters
 */

// Mock data
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
];

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: GET /users/:id - Return user by ID
  // If not found, return 404 with { error: 'User not found' }


  // TODO: GET /search?name=Alice - Search users by name (case-insensitive)
  // Return array of matching users


  // TODO: GET /users/:id/posts/:postId - Multiple parameters
  // Return: { userId: ..., postId: ... }


  // TODO: GET /filter?minAge=30&maxAge=40 - Multiple query params
  // Return users within age range


  return app;
}

// Tests
describe('Exercise 128: Route Parameters & Query Strings', () => {
  const app = createApp();

  it('should get user by ID', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'Alice', age: 25 });
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app).get('/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  it('should search users by name', async () => {
    const response = await request(app).get('/search?name=bob');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 2, name: 'Bob', age: 30 }]);
  });

  it('should handle multiple route parameters', async () => {
    const response = await request(app).get('/users/5/posts/10');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: '5', postId: '10' });
  });

  it('should filter by age range', async () => {
    const response = await request(app).get('/filter?minAge=30&maxAge=40');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 }
    ]);
  });
});

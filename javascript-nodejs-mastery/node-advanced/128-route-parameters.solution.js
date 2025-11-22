import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 128: Route Parameters & Query Strings - SOLUTION
 */

const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
];

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  });

  app.get('/search', (req, res) => {
    const name = req.query.name?.toLowerCase();
    const results = users.filter(u =>
      u.name.toLowerCase().includes(name)
    );
    res.json(results);
  });

  app.get('/users/:id/posts/:postId', (req, res) => {
    res.json({
      userId: req.params.id,
      postId: req.params.postId
    });
  });

  app.get('/filter', (req, res) => {
    const minAge = parseInt(req.query.minAge);
    const maxAge = parseInt(req.query.maxAge);

    const filtered = users.filter(u =>
      u.age >= minAge && u.age <= maxAge
    );

    res.json(filtered);
  });

  return app;
}

// Tests
describe('Exercise 128: Route Parameters & Query Strings - Solution', () => {
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

import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 136: HTTP Status Codes - SOLUTION
 */

const users = [];
let nextId = 1;

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/users', (req, res) => {
    res.status(200).json(users);
  });

  app.post('/api/users', (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = {
      id: nextId++,
      name: req.body.name,
      email: req.body.email
    };
    users.push(user);
    res.status(201).json(user);
  });

  app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  });

  app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users.splice(index, 1);
    res.status(204).send();
  });

  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
      return res.status(200).json({ message: 'Login successful' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  });

  app.get('/api/admin', (req, res) => {
    if (req.headers['x-admin-token'] === 'secret') {
      return res.status(200).json({ message: 'Admin access granted' });
    }
    res.status(403).json({ error: 'Forbidden' });
  });

  app.get('/api/error', (req, res) => {
    res.status(500).json({ error: 'Internal server error' });
  });

  app.post('/api/conflict', (req, res) => {
    const existingUser = users.find(u => u.email === req.body.email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(201).json({ message: 'User created' });
  });

  app.get('/api/redirect', (req, res) => {
    res.redirect(302, '/api/users');
  });

  return app;
}

// Tests
describe('Exercise 136: HTTP Status Codes - Solution', () => {
  const app = createApp();

  it('should return 200 for successful GET', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 201 for successful POST', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Bob', email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 204 for successful DELETE', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'ToDelete', email: 'delete@example.com' });

    const response = await request(app).delete('/api/users/2');
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 200 for valid login', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'password' });

    expect(response.status).toBe(200);
  });

  it('should return 403 for forbidden access', async () => {
    const response = await request(app).get('/api/admin');
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 200 with valid admin token', async () => {
    const response = await request(app)
      .get('/api/admin')
      .set('x-admin-token', 'secret');

    expect(response.status).toBe(200);
  });

  it('should return 500 for server error', async () => {
    const response = await request(app).get('/api/error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 409 for duplicate email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'User1', email: 'duplicate@example.com' });

    const response = await request(app)
      .post('/api/conflict')
      .send({ name: 'User2', email: 'duplicate@example.com' });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 302 for redirect', async () => {
    const response = await request(app).get('/api/redirect');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/api/users');
  });
});

import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 129: Request Body Parsing - SOLUTION
 */

const users = [];
let nextId = 1;

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.text());

  app.post('/api/users', (req, res) => {
    const user = {
      id: nextId++,
      name: req.body.name,
      email: req.body.email
    };
    users.push(user);
    res.status(201).json(user);
  });

  app.post('/api/contact', (req, res) => {
    res.json({
      success: true,
      data: {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
      }
    });
  });

  app.post('/api/text', (req, res) => {
    res.json({
      received: req.body,
      length: req.body.length
    });
  });

  app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = {
      id: userId,
      name: req.body.name,
      email: req.body.email
    };

    res.json(users[userIndex]);
  });

  app.post('/api/users/bulk', (req, res) => {
    const newUsers = req.body.map(userData => ({
      id: nextId++,
      name: userData.name,
      email: userData.email
    }));

    users.push(...newUsers);

    res.status(201).json({
      created: newUsers.length,
      users: newUsers
    });
  });

  app.patch('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }
    if (req.body.email !== undefined) {
      user.email = req.body.email;
    }

    res.json(user);
  });

  return app;
}

// Tests
describe('Exercise 129: Request Body Parsing - Solution', () => {
  const app = createApp();

  it('should create user from JSON body', async () => {
    const userData = { name: 'Alice', email: 'alice@example.com' };
    const response = await request(app)
      .post('/api/users')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com'
    });
  });

  it('should handle URL-encoded form data', async () => {
    const response = await request(app)
      .post('/api/contact')
      .type('form')
      .send('name=Bob&email=bob@example.com&message=Hello');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        name: 'Bob',
        email: 'bob@example.com',
        message: 'Hello'
      }
    });
  });

  it('should handle plain text body', async () => {
    const response = await request(app)
      .post('/api/text')
      .set('Content-Type', 'text/plain')
      .send('Hello, World!');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      received: 'Hello, World!',
      length: 13
    });
  });

  it('should update user', async () => {
    // First create a user
    await request(app)
      .post('/api/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });

    // Then update
    const response = await request(app)
      .put('/api/users/2')
      .send({ name: 'Charles', email: 'charles@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      name: 'Charles',
      email: 'charles@example.com'
    });
  });

  it('should return 404 for non-existent user update', async () => {
    const response = await request(app)
      .put('/api/users/999')
      .send({ name: 'Test', email: 'test@example.com' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  it('should create multiple users in bulk', async () => {
    const bulkUsers = [
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
      { name: 'User3', email: 'user3@example.com' }
    ];

    const response = await request(app)
      .post('/api/users/bulk')
      .send(bulkUsers);

    expect(response.status).toBe(201);
    expect(response.body.created).toBe(3);
    expect(response.body.users).toHaveLength(3);
    expect(response.body.users[0]).toHaveProperty('id');
  });

  it('should partially update user', async () => {
    // Create a user
    await request(app)
      .post('/api/users')
      .send({ name: 'David', email: 'david@example.com' });

    // Partial update - only name
    const response = await request(app)
      .patch('/api/users/6')
      .send({ name: 'Dave' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Dave');
    expect(response.body.email).toBe('david@example.com');
  });
});

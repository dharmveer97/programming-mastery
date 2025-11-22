import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 129: Request Body Parsing
 *
 * Express doesn't parse request bodies by default.
 * You need middleware to parse different content types:
 *
 * Key concepts:
 * - express.json() - Parse JSON request bodies
 * - express.urlencoded() - Parse URL-encoded form data
 * - express.text() - Parse plain text
 * - express.raw() - Parse raw buffer data
 * - Access via req.body
 *
 * Task: Handle different request body formats
 */

const users = [];

export function createApp() {
  const app = express();

  // TODO: Add middleware to parse JSON bodies


  // TODO: Add middleware to parse URL-encoded bodies (extended: true)


  // TODO: Add middleware to parse text/plain


  // TODO: POST /api/users - Create user from JSON body
  // Expect: { name, email }
  // Return: created user with id


  // TODO: POST /api/contact - Handle form submission (URL-encoded)
  // Expect: name, email, message
  // Return: { success: true, data: { ... } }


  // TODO: POST /api/text - Echo plain text body
  // Return: { received: <text>, length: <number> }


  // TODO: PUT /api/users/:id - Update user
  // Expect: { name, email } in body
  // Return: updated user or 404


  // TODO: POST /api/users/bulk - Create multiple users
  // Expect: array of users in body
  // Return: { created: <count>, users: [...] }


  // TODO: PATCH /api/users/:id - Partial update
  // Accept any subset of { name, email }
  // Return: updated user


  return app;
}

// Tests
describe('Exercise 129: Request Body Parsing', () => {
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

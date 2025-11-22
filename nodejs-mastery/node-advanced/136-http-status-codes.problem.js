import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 136: HTTP Status Codes
 *
 * HTTP status codes indicate the result of an HTTP request.
 * Using the correct status code is crucial for API design.
 *
 * Key concepts:
 * - 2xx Success: 200 OK, 201 Created, 204 No Content
 * - 3xx Redirection: 301 Moved Permanently, 302 Found, 304 Not Modified
 * - 4xx Client Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
 * - 5xx Server Errors: 500 Internal Server Error, 503 Service Unavailable
 *
 * Task: Use appropriate status codes in different scenarios
 */

const users = [];
let nextId = 1;

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: GET /api/users - Return 200 with users array


  // TODO: POST /api/users - Return 201 when created successfully
  // Validate email format, return 400 if invalid


  // TODO: GET /api/users/:id - Return 200 if found, 404 if not found


  // TODO: DELETE /api/users/:id - Return 204 (No Content) on success


  // TODO: POST /api/login - Mock login endpoint
  // Return 401 if credentials are invalid
  // Accept: { username, password }
  // Valid: username='admin', password='password'


  // TODO: GET /api/admin - Return 403 Forbidden
  // Check header x-admin-token === 'secret'


  // TODO: GET /api/error - Simulate server error, return 500


  // TODO: POST /api/conflict - Check if user exists by email
  // Return 409 Conflict if email already exists


  // TODO: GET /api/redirect - Return 302 redirect to /api/users


  return app;
}

// Tests
describe('Exercise 136: HTTP Status Codes', () => {
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

import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 126: Express Basics
 *
 * Express is a minimal web framework for Node.js.
 * It simplifies creating web servers and APIs.
 *
 * Key concepts:
 * - Create an Express app with express()
 * - Define routes with app.get(), app.post(), etc.
 * - Send responses with res.send(), res.json()
 * - Listen on a port with app.listen()
 *
 * Task: Create basic Express routes
 */

// TODO: Create an Express app with basic routes
export function createApp() {
  const app = express();

  // Enable JSON parsing
  app.use(express.json());

  // TODO: Create GET / route that returns 'Hello World!'


  // TODO: Create GET /about route that returns 'About Page'


  // TODO: Create GET /api/status route that returns JSON: { status: 'ok' }


  // TODO: Create POST /api/echo route that echoes back the request body


  return app;
}

// Tests (using supertest for HTTP testing)
describe('Exercise 126: Express Basics', () => {
  const app = createApp();

  it('should return Hello World on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  it('should return About Page on GET /about', async () => {
    const response = await request(app).get('/about');
    expect(response.status).toBe(200);
    expect(response.text).toBe('About Page');
  });

  it('should return status JSON on GET /api/status', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('should echo request body on POST /api/echo', async () => {
    const testData = { message: 'hello' };
    const response = await request(app)
      .post('/api/echo')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(testData);
  });
});

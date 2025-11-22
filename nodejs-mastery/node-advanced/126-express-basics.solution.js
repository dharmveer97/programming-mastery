import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 126: Express Basics - SOLUTION
 */

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/about', (req, res) => {
    res.send('About Page');
  });

  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/echo', (req, res) => {
    res.json(req.body);
  });

  return app;
}

// Tests
describe('Exercise 126: Express Basics - Solution', () => {
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

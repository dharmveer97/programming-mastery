import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 130: Middleware Basics
 *
 * Middleware are functions that execute during request-response cycle.
 * They have access to req, res, and next() function.
 *
 * Key concepts:
 * - Middleware signature: (req, res, next) => {}
 * - Call next() to pass control to next middleware
 * - Middleware executes in order
 * - Can modify req and res objects
 * - Can end request-response cycle
 *
 * Task: Create and use various middleware
 */

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: Create middleware that logs request method and URL
  // Should call next() to continue


  // TODO: Create middleware that adds timestamp to req object
  // req.timestamp = new Date().toISOString()


  // TODO: Create middleware that adds custom header to all responses
  // X-Powered-By: MyApp


  // TODO: GET / - Return { message: 'Home', timestamp: req.timestamp }


  // TODO: GET /api/data - Should show the custom header


  // TODO: Create route-specific middleware for /admin routes only
  // Check if req.query.admin === 'true', otherwise return 403


  // TODO: GET /admin/dashboard - Protected by admin middleware
  // Return: { message: 'Admin Dashboard' }


  // TODO: Create middleware that counts requests
  // Store count in a variable and add to req.requestCount


  // TODO: GET /stats - Return request count
  // Return: { totalRequests: req.requestCount }


  return app;
}

// Tests
describe('Exercise 130: Middleware Basics', () => {
  const app = createApp();

  it('should add timestamp to request', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should add custom header to response', async () => {
    const response = await request(app).get('/api/data');
    expect(response.headers['x-powered-by']).toBe('MyApp');
  });

  it('should protect admin routes', async () => {
    const response = await request(app).get('/admin/dashboard');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden' });
  });

  it('should allow admin access with correct query param', async () => {
    const response = await request(app).get('/admin/dashboard?admin=true');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Admin Dashboard' });
  });

  it('should count requests', async () => {
    await request(app).get('/');
    await request(app).get('/');
    const response = await request(app).get('/stats');

    expect(response.status).toBe(200);
    expect(response.body.totalRequests).toBeGreaterThan(0);
  });

  it('should execute middleware in order', async () => {
    const response = await request(app).get('/');

    // Should have timestamp (from middleware)
    expect(response.body.timestamp).toBeDefined();
    // Should have custom header (from middleware)
    expect(response.headers['x-powered-by']).toBe('MyApp');
  });

  it('should handle multiple requests correctly', async () => {
    const response1 = await request(app).get('/');
    const response2 = await request(app).get('/');

    expect(response1.body.timestamp).toBeDefined();
    expect(response2.body.timestamp).toBeDefined();
    // Timestamps might be same or different depending on timing
  });
});

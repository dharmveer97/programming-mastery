import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 130: Middleware Basics - SOLUTION
 */

export function createApp() {
  const app = express();
  app.use(express.json());

  let requestCount = 0;

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Timestamp middleware
  app.use((req, res, next) => {
    req.timestamp = new Date().toISOString();
    next();
  });

  // Custom header middleware
  app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'MyApp');
    next();
  });

  // Request counter middleware
  app.use((req, res, next) => {
    requestCount++;
    req.requestCount = requestCount;
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Home',
      timestamp: req.timestamp
    });
  });

  app.get('/api/data', (req, res) => {
    res.json({ data: 'Some data' });
  });

  // Admin middleware
  const adminAuth = (req, res, next) => {
    if (req.query.admin === 'true') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };

  app.get('/admin/dashboard', adminAuth, (req, res) => {
    res.json({ message: 'Admin Dashboard' });
  });

  app.get('/stats', (req, res) => {
    res.json({ totalRequests: req.requestCount });
  });

  return app;
}

// Tests
describe('Exercise 130: Middleware Basics - Solution', () => {
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

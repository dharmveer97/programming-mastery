import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 131: Custom Middleware
 *
 * Custom middleware allows you to implement cross-cutting concerns
 * like logging, authentication, request tracking, etc.
 *
 * Key concepts:
 * - Reusable middleware functions
 * - Middleware with configuration (factory pattern)
 * - Request/response modification
 * - Conditional middleware execution
 *
 * Task: Create practical custom middleware
 */

// TODO: Create logger middleware that logs: timestamp, method, url, status code
// Should log after response is sent (use res.on('finish'))
export function logger() {
  const logs = [];

  return {
    middleware: (req, res, next) => {
      // TODO: Implement logging
      next();
    },
    getLogs: () => logs
  };
}

// TODO: Create auth middleware that checks for API key
// Check req.headers['x-api-key']
// If matches provided apiKey, call next()
// Otherwise return 401: { error: 'Unauthorized' }
export function apiKeyAuth(apiKey) {
  // TODO: Implement
}

// TODO: Create rate limiter middleware
// Track requests per IP address
// Limit: maxRequests per windowMs
// Return 429 if exceeded: { error: 'Too many requests' }
export function rateLimiter(options = { maxRequests: 5, windowMs: 60000 }) {
  // TODO: Implement
}

// TODO: Create request ID middleware
// Add unique ID to each request: req.id
// Add X-Request-ID header to response
export function requestId() {
  // TODO: Implement
}

// TODO: Create response time middleware
// Calculate time taken for request
// Add X-Response-Time header in ms
export function responseTime() {
  // TODO: Implement
}

export function createApp() {
  const app = express();
  app.use(express.json());

  const loggerInstance = logger();

  // TODO: Use all middleware
  // - logger
  // - requestId
  // - responseTime


  // Public route
  app.get('/public', (req, res) => {
    res.json({ message: 'Public endpoint' });
  });

  // TODO: Protected route with API key auth
  // Use apiKeyAuth middleware with key 'secret123'
  app.get('/protected', (req, res) => {
    res.json({ message: 'Protected data' });
  });

  // TODO: Rate limited route
  // Use rateLimiter with maxRequests: 3, windowMs: 1000
  app.get('/limited', (req, res) => {
    res.json({ message: 'Limited endpoint' });
  });

  // Endpoint to get logs
  app.get('/logs', (req, res) => {
    res.json({ logs: loggerInstance.getLogs() });
  });

  return app;
}

// Tests
describe('Exercise 131: Custom Middleware', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it('should add request ID to response header', async () => {
    const response = await request(app).get('/public');
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-request-id']).toMatch(/^[a-f0-9-]+$/);
  });

  it('should add response time header', async () => {
    const response = await request(app).get('/public');
    expect(response.headers['x-response-time']).toBeDefined();
    expect(response.headers['x-response-time']).toMatch(/^\d+ms$/);
  });

  it('should log requests', async () => {
    await request(app).get('/public');
    const logsResponse = await request(app).get('/logs');

    expect(logsResponse.body.logs.length).toBeGreaterThan(0);
    const log = logsResponse.body.logs[0];
    expect(log).toHaveProperty('timestamp');
    expect(log).toHaveProperty('method');
    expect(log).toHaveProperty('url');
    expect(log).toHaveProperty('status');
  });

  it('should reject request without API key', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('should allow request with valid API key', async () => {
    const response = await request(app)
      .get('/protected')
      .set('x-api-key', 'secret123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Protected data' });
  });

  it('should rate limit requests', async () => {
    // Make 3 requests (within limit)
    await request(app).get('/limited');
    await request(app).get('/limited');
    await request(app).get('/limited');

    // 4th request should be rate limited
    const response = await request(app).get('/limited');
    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: 'Too many requests' });
  });

  it('should reset rate limit after window', async () => {
    // Make 3 requests
    await request(app).get('/limited');
    await request(app).get('/limited');
    await request(app).get('/limited');

    // Wait for window to reset (1 second + buffer)
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Should work again
    const response = await request(app).get('/limited');
    expect(response.status).toBe(200);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import crypto from 'crypto';

/**
 * Exercise 131: Custom Middleware - SOLUTION
 */

export function logger() {
  const logs = [];

  return {
    middleware: (req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        logs.push({
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: Date.now() - start
        });
      });

      next();
    },
    getLogs: () => logs
  };
}

export function apiKeyAuth(apiKey) {
  return (req, res, next) => {
    const providedKey = req.headers['x-api-key'];

    if (providedKey === apiKey) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

export function rateLimiter(options = { maxRequests: 5, windowMs: 60000 }) {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(
      time => now - time < options.windowMs
    );

    if (recentRequests.length >= options.maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
}

export function requestId() {
  return (req, res, next) => {
    const id = crypto.randomUUID();
    req.id = id;
    res.setHeader('X-Request-ID', id);
    next();
  };
}

export function responseTime() {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      res.setHeader('X-Response-Time', `${duration}ms`);
    });

    next();
  };
}

export function createApp() {
  const app = express();
  app.use(express.json());

  const loggerInstance = logger();

  app.use(loggerInstance.middleware);
  app.use(requestId());
  app.use(responseTime());

  app.get('/public', (req, res) => {
    res.json({ message: 'Public endpoint' });
  });

  app.get('/protected', apiKeyAuth('secret123'), (req, res) => {
    res.json({ message: 'Protected data' });
  });

  app.get('/limited', rateLimiter({ maxRequests: 3, windowMs: 1000 }), (req, res) => {
    res.json({ message: 'Limited endpoint' });
  });

  app.get('/logs', (req, res) => {
    res.json({ logs: loggerInstance.getLogs() });
  });

  return app;
}

// Tests
describe('Exercise 131: Custom Middleware - Solution', () => {
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

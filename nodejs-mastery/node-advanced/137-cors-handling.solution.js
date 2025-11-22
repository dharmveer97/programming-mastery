import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import cors from 'cors';

/**
 * Exercise 137: CORS Handling - SOLUTION
 */

export function createAppWithBasicCors() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get('/api/public', (req, res) => {
    res.json({ message: 'Public endpoint' });
  });

  return app;
}

export function createAppWithSpecificOrigin() {
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: 'https://example.com'
  }));

  app.get('/api/data', (req, res) => {
    res.json({ data: 'restricted' });
  });

  return app;
}

export function createAppWithMultipleOrigins() {
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: ['https://app1.com', 'https://app2.com']
  }));

  app.get('/api/resource', (req, res) => {
    res.json({ resource: 'data' });
  });

  return app;
}

export function createAppWithCustomCors() {
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: 'https://trusted.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
  }));

  app.get('/api/secure', (req, res) => {
    res.json({ message: 'Secure endpoint' });
  });

  app.post('/api/secure', (req, res) => {
    res.json({ message: 'Created' });
  });

  return app;
}

export function createAppWithRouteCors() {
  const app = express();
  app.use(express.json());

  app.get('/api/public', cors(), (req, res) => {
    res.json({ message: 'Public' });
  });

  app.get('/api/private', (req, res) => {
    res.json({ message: 'Private' });
  });

  return app;
}

export function createAppWithDynamicOrigin() {
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || origin.endsWith('.trusted.com')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  }));

  app.get('/api/dynamic', (req, res) => {
    res.json({ message: 'Dynamic CORS' });
  });

  return app;
}

// Tests
describe('Exercise 137: CORS Handling - Solution', () => {
  it('should allow all origins with basic CORS', async () => {
    const app = createAppWithBasicCors();
    const response = await request(app)
      .get('/api/public')
      .set('Origin', 'https://example.com');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('should allow specific origin', async () => {
    const app = createAppWithSpecificOrigin();
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'https://example.com');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://example.com');
  });

  it('should reject non-allowed origin', async () => {
    const app = createAppWithSpecificOrigin();
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'https://malicious.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('should allow multiple origins', async () => {
    const app = createAppWithMultipleOrigins();

    const response1 = await request(app)
      .get('/api/resource')
      .set('Origin', 'https://app1.com');
    expect(response1.headers['access-control-allow-origin']).toBe('https://app1.com');

    const response2 = await request(app)
      .get('/api/resource')
      .set('Origin', 'https://app2.com');
    expect(response2.headers['access-control-allow-origin']).toBe('https://app2.com');
  });

  it('should handle preflight requests', async () => {
    const app = createAppWithCustomCors();
    const response = await request(app)
      .options('/api/secure')
      .set('Origin', 'https://trusted.com')
      .set('Access-Control-Request-Method', 'POST');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods']).toContain('POST');
  });

  it('should expose custom headers in CORS', async () => {
    const app = createAppWithCustomCors();
    const response = await request(app)
      .get('/api/secure')
      .set('Origin', 'https://trusted.com');

    expect(response.headers['access-control-allow-credentials']).toBe('true');
    expect(response.headers['access-control-max-age']).toBe('86400');
  });

  it('should apply CORS only to specific routes', async () => {
    const app = createAppWithRouteCors();

    const publicResponse = await request(app)
      .get('/api/public')
      .set('Origin', 'https://example.com');
    expect(publicResponse.headers['access-control-allow-origin']).toBeDefined();

    const privateResponse = await request(app)
      .get('/api/private')
      .set('Origin', 'https://example.com');
    expect(privateResponse.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('should validate origin dynamically', async () => {
    const app = createAppWithDynamicOrigin();

    const validResponse = await request(app)
      .get('/api/dynamic')
      .set('Origin', 'https://app.trusted.com');
    expect(validResponse.headers['access-control-allow-origin']).toBe('https://app.trusted.com');

    const invalidResponse = await request(app)
      .get('/api/dynamic')
      .set('Origin', 'https://malicious.com');
    expect(invalidResponse.headers['access-control-allow-origin']).toBeUndefined();
  });
});

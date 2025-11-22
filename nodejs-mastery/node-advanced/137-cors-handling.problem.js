import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import cors from 'cors';

/**
 * Exercise 137: CORS Handling
 *
 * CORS (Cross-Origin Resource Sharing) allows servers to specify
 * which origins can access their resources.
 *
 * Key concepts:
 * - Enable CORS with cors() middleware
 * - Configure allowed origins
 * - Set allowed methods and headers
 * - Handle preflight requests (OPTIONS)
 * - Credentials and CORS
 *
 * Task: Configure CORS for different scenarios
 */

// TODO: Create app with basic CORS enabled for all origins
export function createAppWithBasicCors() {
  const app = express();
  app.use(express.json());

  // TODO: Enable CORS for all origins


  app.get('/api/public', (req, res) => {
    res.json({ message: 'Public endpoint' });
  });

  return app;
}

// TODO: Create app with specific origin allowed
export function createAppWithSpecificOrigin() {
  const app = express();
  app.use(express.json());

  // TODO: Only allow https://example.com


  app.get('/api/data', (req, res) => {
    res.json({ data: 'restricted' });
  });

  return app;
}

// TODO: Create app with multiple allowed origins
export function createAppWithMultipleOrigins() {
  const app = express();
  app.use(express.json());

  // TODO: Allow https://app1.com and https://app2.com


  app.get('/api/resource', (req, res) => {
    res.json({ resource: 'data' });
  });

  return app;
}

// TODO: Create app with custom CORS configuration
export function createAppWithCustomCors() {
  const app = express();
  app.use(express.json());

  // TODO: Configure CORS with:
  // - Specific origins: https://trusted.com
  // - Methods: GET, POST, PUT, DELETE
  // - Headers: Content-Type, Authorization
  // - Credentials: true
  // - Max age: 86400


  app.get('/api/secure', (req, res) => {
    res.json({ message: 'Secure endpoint' });
  });

  app.post('/api/secure', (req, res) => {
    res.json({ message: 'Created' });
  });

  return app;
}

// TODO: Create app with route-specific CORS
export function createAppWithRouteCors() {
  const app = express();
  app.use(express.json());

  // Public route - CORS enabled
  // TODO: Enable CORS only for this route
  app.get('/api/public', (req, res) => {
    res.json({ message: 'Public' });
  });

  // Private route - No CORS
  app.get('/api/private', (req, res) => {
    res.json({ message: 'Private' });
  });

  return app;
}

// TODO: Create app with dynamic origin validation
export function createAppWithDynamicOrigin() {
  const app = express();
  app.use(express.json());

  // TODO: Allow origins ending with .trusted.com
  // Use a function to validate origin dynamically


  app.get('/api/dynamic', (req, res) => {
    res.json({ message: 'Dynamic CORS' });
  });

  return app;
}

// Tests
describe('Exercise 137: CORS Handling', () => {
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

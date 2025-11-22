import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 132: Error Handling Middleware - SOLUTION
 */

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorLogger(err, req, res, next) {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  next(err);
}

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode
    });
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      status: 400
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: err.message || 'Internal server error',
    status: 500
  });
}

export function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Route ${req.url} not found`));
}

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/sync-error', (req, res) => {
    throw new Error('Sync error occurred');
  });

  app.get('/async-error', asyncHandler(async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 10));
    throw new Error('Async error occurred');
  }));

  app.post('/validate', (req, res, next) => {
    if (!req.body.email) {
      throw new ValidationError('Email is required');
    }
    res.json({ message: 'Valid' });
  });

  app.get('/users/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if (id === 404) {
      throw new NotFoundError('User not found');
    }
    res.json({ id, name: 'User' });
  });

  app.get('/next-error', (req, res, next) => {
    next(new AppError('Error via next()', 418));
  });

  // 404 handler (before error handlers)
  app.use(notFoundHandler);

  // Error handlers (order matters)
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}

// Tests
describe('Exercise 132: Error Handling Middleware - Solution', () => {
  const app = createApp();

  it('should handle synchronous errors', async () => {
    const response = await request(app).get('/sync-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle asynchronous errors', async () => {
    const response = await request(app).get('/async-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle validation errors with 400', async () => {
    const response = await request(app)
      .post('/validate')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email is required');
  });

  it('should handle not found errors with 404', async () => {
    const response = await request(app).get('/users/404');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should handle errors passed via next()', async () => {
    const response = await request(app).get('/next-error');
    expect(response.status).toBe(418);
    expect(response.body.error).toBe('Error via next()');
  });

  it('should handle 404 for non-existent routes', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle malformed JSON', async () => {
    const response = await request(app)
      .post('/validate')
      .set('Content-Type', 'application/json')
      .send('{"invalid json}');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return proper error structure', async () => {
    const response = await request(app).get('/sync-error');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('status');
  });
});

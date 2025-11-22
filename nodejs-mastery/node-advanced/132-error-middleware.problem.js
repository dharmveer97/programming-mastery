import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 132: Error Handling Middleware
 *
 * Error middleware has 4 parameters: (err, req, res, next)
 * It catches errors from routes and other middleware.
 *
 * Key concepts:
 * - Error middleware signature: (err, req, res, next)
 * - Must be defined AFTER routes
 * - Can handle sync and async errors
 * - Use next(error) to pass errors to error handler
 * - Async errors need try-catch or wrapper
 *
 * Task: Implement comprehensive error handling
 */

// TODO: Create custom error classes
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    // TODO: Add statusCode property
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    // TODO: Call super with 400 status
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    // TODO: Call super with 404 status
  }
}

// TODO: Create async error wrapper
// Wraps async route handlers to catch errors
export function asyncHandler(fn) {
  // TODO: Return function that catches async errors
}

// TODO: Create error logging middleware
// Log errors before sending response
export function errorLogger(err, req, res, next) {
  // TODO: Log error details
  // TODO: Call next(err) to pass to next error handler
}

// TODO: Create main error handler middleware
// Handle different error types appropriately
export function errorHandler(err, req, res, next) {
  // TODO: Handle AppError instances
  // TODO: Handle validation errors
  // TODO: Handle unexpected errors (500)
  // Return: { error: message, status: statusCode }
}

// TODO: Create 404 handler middleware
// Catches requests to non-existent routes
export function notFoundHandler(req, res, next) {
  // TODO: Create NotFoundError and pass to next
}

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: Sync route that throws error
  app.get('/sync-error', (req, res) => {
    throw new Error('Sync error occurred');
  });

  // TODO: Async route that throws error (use asyncHandler)
  app.get('/async-error', asyncHandler(async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 10));
    throw new Error('Async error occurred');
  }));

  // TODO: Route that throws ValidationError
  app.post('/validate', (req, res, next) => {
    if (!req.body.email) {
      throw new ValidationError('Email is required');
    }
    res.json({ message: 'Valid' });
  });

  // TODO: Route that throws NotFoundError
  app.get('/users/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if (id === 404) {
      throw new NotFoundError('User not found');
    }
    res.json({ id, name: 'User' });
  });

  // TODO: Route that uses next(error)
  app.get('/next-error', (req, res, next) => {
    next(new AppError('Error via next()', 418));
  });

  // TODO: Route with JSON parsing error
  // Express will automatically catch this


  // TODO: Add 404 handler (before error handlers)


  // TODO: Add error logger middleware


  // TODO: Add main error handler


  return app;
}

// Tests
describe('Exercise 132: Error Handling Middleware', () => {
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

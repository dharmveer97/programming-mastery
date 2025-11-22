import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 139: JSON Response Patterns
 *
 * Consistent JSON response structure improves API usability.
 * Learn different patterns for structuring API responses.
 *
 * Key concepts:
 * - res.json() vs res.send()
 * - res.status().json()
 * - Consistent response structure
 * - Success/error response patterns
 * - Pagination metadata
 * - API response wrapper
 *
 * Task: Implement consistent JSON response patterns
 */

// TODO: Create success response wrapper
export function successResponse(data, message = 'Success') {
  // Return: { success: true, message, data }
}

// TODO: Create error response wrapper
export function errorResponse(message, errors = null) {
  // Return: { success: false, message, errors }
}

// TODO: Create paginated response wrapper
export function paginatedResponse(data, page, limit, total) {
  // Return: {
  //   success: true,
  //   data,
  //   pagination: { page, limit, total, totalPages }
  // }
}

export function createApp() {
  const app = express();
  app.use(express.json());

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];

  // TODO: GET /api/users - Return users with success wrapper


  // TODO: GET /api/users/:id - Return single user with success wrapper
  // Use errorResponse for 404


  // TODO: POST /api/users - Create user with success wrapper
  // Return 201 status


  // TODO: GET /api/users/paginated - Paginated response
  // Query params: page (default 1), limit (default 2)
  // Use paginatedResponse wrapper


  // TODO: GET /api/formatted - Return formatted JSON with proper headers
  // Set Content-Type: application/json
  // Return: { timestamp: ISO string, data: { message: 'Formatted response' } }


  // TODO: GET /api/nested - Return deeply nested response
  // Structure: {
  //   success: true,
  //   data: {
  //     user: { id: 1, name: 'Alice' },
  //     metadata: { created: ISO, version: '1.0' }
  //   }
  // }


  // TODO: GET /api/array - Return array directly vs wrapped
  // Use query param: wrapped (true/false)
  // If wrapped=true: { success: true, data: [...] }
  // If wrapped=false: [...]


  // TODO: POST /api/bulk - Handle bulk operation response
  // Accept array of users
  // Return: {
  //   success: true,
  //   message: 'Bulk operation completed',
  //   data: { created: count, items: [...] }
  // }


  return app;
}

// Tests
describe('Exercise 139: JSON Response Patterns', () => {
  const app = createApp();

  it('should return users with success wrapper', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(3);
    expect(response.body.message).toBeDefined();
  });

  it('should return single user with success wrapper', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: { id: 1, name: 'Alice' }
    });
  });

  it('should return error response for 404', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: expect.any(String)
    });
  });

  it('should create user with success wrapper and 201 status', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'David', email: 'david@example.com' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: 'David',
      email: 'david@example.com'
    });
  });

  it('should return paginated response', async () => {
    const response = await request(app).get('/api/users/paginated?page=1&limit=2');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: expect.any(Array),
      pagination: {
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2
      }
    });
    expect(response.body.data).toHaveLength(2);
  });

  it('should return second page of paginated results', async () => {
    const response = await request(app).get('/api/users/paginated?page=2&limit=2');
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination.page).toBe(2);
  });

  it('should return formatted JSON with proper headers', async () => {
    const response = await request(app).get('/api/formatted');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(response.body.data).toEqual({ message: 'Formatted response' });
  });

  it('should return deeply nested response', async () => {
    const response = await request(app).get('/api/nested');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.metadata).toBeDefined();
    expect(response.body.data.metadata.version).toBe('1.0');
  });

  it('should return wrapped array when requested', async () => {
    const response = await request(app).get('/api/array?wrapped=true');
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return unwrapped array when requested', async () => {
    const response = await request(app).get('/api/array?wrapped=false');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
  });

  it('should handle bulk operation response', async () => {
    const response = await request(app)
      .post('/api/bulk')
      .send([
        { name: 'User1', email: 'user1@example.com' },
        { name: 'User2', email: 'user2@example.com' }
      ]);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Bulk operation completed',
      data: {
        created: 2,
        items: expect.any(Array)
      }
    });
  });
});

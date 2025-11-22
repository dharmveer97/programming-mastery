import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 139: JSON Response Patterns - SOLUTION
 */

export function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data
  };
}

export function errorResponse(message, errors = null) {
  const response = {
    success: false,
    message
  };
  if (errors) {
    response.errors = errors;
  }
  return response;
}

export function paginatedResponse(data, page, limit, total) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export function createApp() {
  const app = express();
  app.use(express.json());

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];

  app.get('/api/users', (req, res) => {
    res.json(successResponse(users, 'Users retrieved successfully'));
  });

  app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    res.json(successResponse(user, 'User found'));
  });

  app.post('/api/users', (req, res) => {
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(successResponse(newUser, 'User created successfully'));
  });

  app.get('/api/users/paginated', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = users.slice(startIndex, endIndex);
    res.json(paginatedResponse(paginatedUsers, page, limit, users.length));
  });

  app.get('/api/formatted', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      timestamp: new Date().toISOString(),
      data: { message: 'Formatted response' }
    });
  });

  app.get('/api/nested', (req, res) => {
    res.json({
      success: true,
      data: {
        user: { id: 1, name: 'Alice' },
        metadata: {
          created: new Date().toISOString(),
          version: '1.0'
        }
      }
    });
  });

  app.get('/api/array', (req, res) => {
    if (req.query.wrapped === 'true') {
      res.json(successResponse(users));
    } else {
      res.json(users);
    }
  });

  app.post('/api/bulk', (req, res) => {
    const newUsers = req.body.map((userData, index) => ({
      id: users.length + index + 1,
      name: userData.name,
      email: userData.email
    }));

    res.status(201).json(successResponse(
      {
        created: newUsers.length,
        items: newUsers
      },
      'Bulk operation completed'
    ));
  });

  return app;
}

// Tests
describe('Exercise 139: JSON Response Patterns - Solution', () => {
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

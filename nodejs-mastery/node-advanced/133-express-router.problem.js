import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 133: Express Router
 *
 * Express Router allows you to create modular, mountable route handlers.
 * Think of it as a mini Express app for organizing routes.
 *
 * Key concepts:
 * - Create router with express.Router()
 * - Define routes on router instead of app
 * - Mount router with app.use(path, router)
 * - Chain route methods
 * - Router-level middleware
 *
 * Task: Create modular routing structure
 */

// TODO: Create users router
// Should handle:
// - GET / - List all users
// - GET /:id - Get user by id
// - POST / - Create user
// - PUT /:id - Update user
// - DELETE /:id - Delete user
export function createUsersRouter() {
  const router = express.Router();

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  let nextId = 3;

  // TODO: Implement user routes


  return router;
}

// TODO: Create posts router
// Should handle:
// - GET / - List all posts
// - GET /:id - Get post by id
// - POST / - Create post
export function createPostsRouter() {
  const router = express.Router();

  const posts = [
    { id: 1, title: 'First Post', content: 'Hello World' }
  ];
  let nextId = 2;

  // TODO: Implement post routes


  return router;
}

// TODO: Create admin router with middleware
// - Add middleware that checks for admin auth
// - GET /stats - Return stats
// - GET /users - Return user count
export function createAdminRouter() {
  const router = express.Router();

  // TODO: Add admin auth middleware to all routes
  // Check req.headers.authorization === 'Bearer admin-token'
  // Return 403 if not authorized


  // TODO: Implement admin routes


  return router;
}

// TODO: Create API v1 router that combines other routers
export function createApiV1Router() {
  const router = express.Router();

  // TODO: Mount users router at /users
  // TODO: Mount posts router at /posts

  // TODO: Add API info route at /
  // Return: { version: 'v1', endpoints: ['/users', '/posts'] }


  return router;
}

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: Mount API v1 router at /api/v1


  // TODO: Mount admin router at /admin


  // TODO: Add root route
  app.get('/', (req, res) => {
    res.json({ message: 'API Server' });
  });

  return app;
}

// Tests
describe('Exercise 133: Express Router', () => {
  const app = createApp();

  it('should list all users', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should get user by id', async () => {
    const response = await request(app).get('/api/v1/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com'
    });
  });

  it('should create new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Charlie',
      email: 'charlie@example.com'
    });
    expect(response.body.id).toBeDefined();
  });

  it('should update user', async () => {
    const response = await request(app)
      .put('/api/v1/users/1')
      .send({ name: 'Alice Updated', email: 'alice.new@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Alice Updated');
  });

  it('should delete user', async () => {
    const response = await request(app).delete('/api/v1/users/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted' });
  });

  it('should list all posts', async () => {
    const response = await request(app).get('/api/v1/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create new post', async () => {
    const response = await request(app)
      .post('/api/v1/posts')
      .send({ title: 'New Post', content: 'Content here' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Post');
  });

  it('should protect admin routes', async () => {
    const response = await request(app).get('/admin/stats');
    expect(response.status).toBe(403);
  });

  it('should allow admin access with token', async () => {
    const response = await request(app)
      .get('/admin/stats')
      .set('Authorization', 'Bearer admin-token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalRequests');
  });

  it('should return API info', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
    expect(response.body.version).toBe('v1');
    expect(response.body.endpoints).toContain('/users');
  });
});

import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 133: Express Router - SOLUTION
 */

export function createUsersRouter() {
  const router = express.Router();

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  let nextId = 3;

  router.get('/', (req, res) => {
    res.json(users);
  });

  router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });

  router.post('/', (req, res) => {
    const user = {
      id: nextId++,
      name: req.body.name,
      email: req.body.email
    };
    users.push(user);
    res.status(201).json(user);
  });

  router.put('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    res.json(user);
  });

  router.delete('/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users.splice(index, 1);
    res.json({ message: 'User deleted' });
  });

  return router;
}

export function createPostsRouter() {
  const router = express.Router();

  const posts = [
    { id: 1, title: 'First Post', content: 'Hello World' }
  ];
  let nextId = 2;

  router.get('/', (req, res) => {
    res.json(posts);
  });

  router.get('/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  });

  router.post('/', (req, res) => {
    const post = {
      id: nextId++,
      title: req.body.title,
      content: req.body.content
    };
    posts.push(post);
    res.status(201).json(post);
  });

  return router;
}

export function createAdminRouter() {
  const router = express.Router();

  // Admin auth middleware for all routes
  router.use((req, res, next) => {
    if (req.headers.authorization === 'Bearer admin-token') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  });

  router.get('/stats', (req, res) => {
    res.json({
      totalRequests: 100,
      uptime: process.uptime()
    });
  });

  router.get('/users', (req, res) => {
    res.json({ userCount: 42 });
  });

  return router;
}

export function createApiV1Router() {
  const router = express.Router();

  router.use('/users', createUsersRouter());
  router.use('/posts', createPostsRouter());

  router.get('/', (req, res) => {
    res.json({
      version: 'v1',
      endpoints: ['/users', '/posts']
    });
  });

  return router;
}

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/v1', createApiV1Router());
  app.use('/admin', createAdminRouter());

  app.get('/', (req, res) => {
    res.json({ message: 'API Server' });
  });

  return app;
}

// Tests
describe('Exercise 133: Express Router - Solution', () => {
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

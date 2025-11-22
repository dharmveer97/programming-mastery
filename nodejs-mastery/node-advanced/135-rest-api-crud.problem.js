import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 135: Complete REST API with CRUD
 *
 * REST (Representational State Transfer) is an architectural style
 * for designing networked applications using HTTP methods.
 *
 * Key concepts:
 * - GET /resource - List all
 * - GET /resource/:id - Get one
 * - POST /resource - Create
 * - PUT /resource/:id - Update (replace)
 * - PATCH /resource/:id - Partial update
 * - DELETE /resource/:id - Delete
 * - Proper status codes
 * - Resource relationships
 *
 * Task: Build a complete REST API for a blog
 */

// TODO: Create a blog API with posts and comments
// Posts have: id, title, content, author, createdAt
// Comments have: id, postId, author, text, createdAt

export function createApp() {
  const app = express();
  app.use(express.json());

  const posts = [];
  const comments = [];
  let nextPostId = 1;
  let nextCommentId = 1;

  // TODO: GET /api/posts - List all posts
  // Support query params: author (filter), sort (title|date), order (asc|desc)


  // TODO: GET /api/posts/:id - Get single post


  // TODO: POST /api/posts - Create post
  // Validate: title and content required
  // Auto-add: id, createdAt


  // TODO: PUT /api/posts/:id - Full update (replace entire post)
  // Require all fields except id and createdAt


  // TODO: PATCH /api/posts/:id - Partial update
  // Update only provided fields


  // TODO: DELETE /api/posts/:id - Delete post
  // Also delete associated comments


  // TODO: GET /api/posts/:id/comments - Get comments for a post


  // TODO: POST /api/posts/:id/comments - Add comment to post
  // Validate: author and text required


  // TODO: DELETE /api/comments/:id - Delete comment


  return app;
}

// Tests
describe('Exercise 135: Complete REST API with CRUD', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it('should create a new post', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({
        title: 'First Post',
        content: 'Hello World',
        author: 'Alice'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      title: 'First Post',
      content: 'Hello World',
      author: 'Alice'
    });
    expect(response.body.createdAt).toBeDefined();
  });

  it('should validate required fields when creating post', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({ author: 'Alice' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should list all posts', async () => {
    await request(app).post('/api/posts').send({
      title: 'Post 1',
      content: 'Content 1',
      author: 'Alice'
    });
    await request(app).post('/api/posts').send({
      title: 'Post 2',
      content: 'Content 2',
      author: 'Bob'
    });

    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should get single post by id', async () => {
    await request(app).post('/api/posts').send({
      title: 'Test Post',
      content: 'Test Content',
      author: 'Alice'
    });

    const response = await request(app).get('/api/posts/1');
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Post');
  });

  it('should return 404 for non-existent post', async () => {
    const response = await request(app).get('/api/posts/999');
    expect(response.status).toBe(404);
  });

  it('should filter posts by author', async () => {
    await request(app).post('/api/posts').send({
      title: 'Alice Post',
      content: 'Content',
      author: 'Alice'
    });
    await request(app).post('/api/posts').send({
      title: 'Bob Post',
      content: 'Content',
      author: 'Bob'
    });

    const response = await request(app).get('/api/posts?author=Alice');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].author).toBe('Alice');
  });

  it('should fully update post with PUT', async () => {
    await request(app).post('/api/posts').send({
      title: 'Original',
      content: 'Original Content',
      author: 'Alice'
    });

    const response = await request(app)
      .put('/api/posts/1')
      .send({
        title: 'Updated',
        content: 'Updated Content',
        author: 'Bob'
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated');
    expect(response.body.author).toBe('Bob');
  });

  it('should partially update post with PATCH', async () => {
    await request(app).post('/api/posts').send({
      title: 'Original',
      content: 'Original Content',
      author: 'Alice'
    });

    const response = await request(app)
      .patch('/api/posts/1')
      .send({ title: 'Updated Title Only' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title Only');
    expect(response.body.content).toBe('Original Content');
    expect(response.body.author).toBe('Alice');
  });

  it('should delete post', async () => {
    await request(app).post('/api/posts').send({
      title: 'To Delete',
      content: 'Content',
      author: 'Alice'
    });

    const deleteResponse = await request(app).delete('/api/posts/1');
    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app).get('/api/posts/1');
    expect(getResponse.status).toBe(404);
  });

  it('should add comment to post', async () => {
    await request(app).post('/api/posts').send({
      title: 'Post',
      content: 'Content',
      author: 'Alice'
    });

    const response = await request(app)
      .post('/api/posts/1/comments')
      .send({
        author: 'Bob',
        text: 'Great post!'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      postId: 1,
      author: 'Bob',
      text: 'Great post!'
    });
  });

  it('should get comments for post', async () => {
    await request(app).post('/api/posts').send({
      title: 'Post',
      content: 'Content',
      author: 'Alice'
    });
    await request(app).post('/api/posts/1/comments').send({
      author: 'Bob',
      text: 'Comment 1'
    });
    await request(app).post('/api/posts/1/comments').send({
      author: 'Charlie',
      text: 'Comment 2'
    });

    const response = await request(app).get('/api/posts/1/comments');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should delete post and its comments', async () => {
    await request(app).post('/api/posts').send({
      title: 'Post',
      content: 'Content',
      author: 'Alice'
    });
    await request(app).post('/api/posts/1/comments').send({
      author: 'Bob',
      text: 'Comment'
    });

    await request(app).delete('/api/posts/1');

    const commentsResponse = await request(app).get('/api/posts/1/comments');
    expect(commentsResponse.status).toBe(404);
  });
});

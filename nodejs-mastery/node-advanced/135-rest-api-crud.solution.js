import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 135: Complete REST API with CRUD - SOLUTION
 */

export function createApp() {
  const app = express();
  app.use(express.json());

  const posts = [];
  const comments = [];
  let nextPostId = 1;
  let nextCommentId = 1;

  app.get('/api/posts', (req, res) => {
    let result = posts;

    // Filter by author
    if (req.query.author) {
      result = result.filter(p => p.author === req.query.author);
    }

    // Sort
    const sortBy = req.query.sort || 'date';
    const order = req.query.order || 'desc';

    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return order === 'desc' ? -comparison : comparison;
    });

    res.json(result);
  });

  app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  });

  app.post('/api/posts', (req, res) => {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = {
      id: nextPostId++,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      createdAt: new Date().toISOString()
    };

    posts.push(post);
    res.status(201).json(post);
  });

  app.put('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!req.body.title || !req.body.content || !req.body.author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    posts[index] = {
      ...posts[index],
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    };

    res.json(posts[index]);
  });

  app.patch('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.content !== undefined) post.content = req.body.content;
    if (req.body.author !== undefined) post.author = req.body.author;

    res.json(post);
  });

  app.delete('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postId = parseInt(req.params.id);
    posts.splice(index, 1);

    // Delete associated comments
    const commentIndices = [];
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].postId === postId) {
        commentIndices.push(i);
      }
    }
    for (const i of commentIndices) {
      comments.splice(i, 1);
    }

    res.json({ message: 'Post deleted' });
  });

  app.get('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postComments = comments.filter(c => c.postId === postId);
    res.json(postComments);
  });

  app.post('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!req.body.author || !req.body.text) {
      return res.status(400).json({ error: 'Author and text are required' });
    }

    const comment = {
      id: nextCommentId++,
      postId,
      author: req.body.author,
      text: req.body.text,
      createdAt: new Date().toISOString()
    };

    comments.push(comment);
    res.status(201).json(comment);
  });

  app.delete('/api/comments/:id', (req, res) => {
    const index = comments.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comments.splice(index, 1);
    res.json({ message: 'Comment deleted' });
  });

  return app;
}

// Tests
describe('Exercise 135: Complete REST API with CRUD - Solution', () => {
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

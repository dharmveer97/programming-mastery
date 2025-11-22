import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exercise 134: Serving Static Files - SOLUTION
 */

const TEST_DIR = path.join(__dirname, 'test-static');

export function createApp() {
  const app = express();

  // Serve public directory at root
  app.use(express.static('public'));

  // Serve assets directory with /assets prefix
  app.use('/assets', express.static('assets'));

  // Serve downloads with cache control
  app.use('/downloads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    next();
  }, express.static('downloads'));

  // Custom static file handler
  app.use('/files', (req, res, next) => {
    res.setHeader('X-Served-By', 'Custom Handler');
    next();
  }, express.static('uploads'));

  // API routes
  app.get('/api/info', (req, res) => {
    res.json({ message: 'API endpoint' });
  });

  return app;
}

// Setup test files
async function setupTestFiles() {
  await fs.mkdir(path.join(TEST_DIR, 'public'), { recursive: true });
  await fs.mkdir(path.join(TEST_DIR, 'assets'), { recursive: true });
  await fs.mkdir(path.join(TEST_DIR, 'downloads'), { recursive: true });
  await fs.mkdir(path.join(TEST_DIR, 'uploads'), { recursive: true });

  await fs.writeFile(
    path.join(TEST_DIR, 'public', 'index.html'),
    '<html><body>Home Page</body></html>'
  );
  await fs.writeFile(
    path.join(TEST_DIR, 'public', 'style.css'),
    'body { margin: 0; }'
  );
  await fs.writeFile(
    path.join(TEST_DIR, 'assets', 'logo.svg'),
    '<svg></svg>'
  );
  await fs.writeFile(
    path.join(TEST_DIR, 'downloads', 'file.txt'),
    'Download content'
  );
  await fs.writeFile(
    path.join(TEST_DIR, 'uploads', 'data.json'),
    '{"key":"value"}'
  );
}

async function cleanupTestFiles() {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
}

// Tests
describe('Exercise 134: Serving Static Files - Solution', () => {
  let app;

  beforeAll(async () => {
    await setupTestFiles();
    // Change to test directory for express.static to work
    process.chdir(TEST_DIR);
    app = createApp();
  });

  afterAll(async () => {
    await cleanupTestFiles();
  });

  it('should serve HTML file from public directory', async () => {
    const response = await request(app).get('/index.html');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Home Page');
    expect(response.headers['content-type']).toContain('text/html');
  });

  it('should serve CSS file from public directory', async () => {
    const response = await request(app).get('/style.css');
    expect(response.status).toBe(200);
    expect(response.text).toContain('margin: 0');
    expect(response.headers['content-type']).toContain('text/css');
  });

  it('should serve files from assets with prefix', async () => {
    const response = await request(app).get('/assets/logo.svg');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<svg>');
  });

  it('should serve downloads with cache headers', async () => {
    const response = await request(app).get('/downloads/file.txt');
    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toContain('max-age=86400');
  });

  it('should serve files with custom handler', async () => {
    const response = await request(app).get('/files/data.json');
    expect(response.status).toBe(200);
    expect(response.headers['x-served-by']).toBe('Custom Handler');
    expect(response.body).toEqual({ key: 'value' });
  });

  it('should return 404 for non-existent static files', async () => {
    const response = await request(app).get('/nonexistent.html');
    expect(response.status).toBe(404);
  });

  it('should not interfere with API routes', async () => {
    const response = await request(app).get('/api/info');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'API endpoint' });
  });
});

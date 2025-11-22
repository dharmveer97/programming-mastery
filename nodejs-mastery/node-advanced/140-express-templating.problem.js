import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exercise 140: Express Template Engines (EJS Basics)
 *
 * Template engines allow you to generate dynamic HTML on the server.
 * EJS (Embedded JavaScript) is a simple templating language.
 *
 * Key concepts:
 * - Set view engine with app.set('view engine', 'ejs')
 * - Set views directory
 * - Render templates with res.render()
 * - Pass data to templates
 * - EJS syntax: <%= %> for output, <% %> for logic
 * - Partials and includes
 *
 * Task: Create server-rendered pages with EJS
 */

const VIEWS_DIR = path.join(__dirname, 'test-views');

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // TODO: Set view engine to 'ejs'


  // TODO: Set views directory to VIEWS_DIR


  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];

  // TODO: GET / - Render 'home' template
  // Pass: { title: 'Home Page', message: 'Welcome to Express' }


  // TODO: GET /users - Render 'users' template
  // Pass: { title: 'Users', users: users }


  // TODO: GET /user/:id - Render 'user' template
  // Pass: { title: 'User Details', user: <found user> }
  // If not found, render 'error' template


  // TODO: GET /about - Render 'about' template
  // Pass: { title: 'About', appName: 'My App', version: '1.0.0' }


  // TODO: POST /submit - Handle form submission
  // Get form data from req.body
  // Render 'result' template with submitted data


  // API endpoint for comparison
  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  return app;
}

// Setup test templates
async function setupTemplates() {
  await fs.mkdir(VIEWS_DIR, { recursive: true });

  // home.ejs
  await fs.writeFile(
    path.join(VIEWS_DIR, 'home.ejs'),
    `<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
<h1><%= message %></h1>
<p>This is a server-rendered page</p>
</body>
</html>`
  );

  // users.ejs
  await fs.writeFile(
    path.join(VIEWS_DIR, 'users.ejs'),
    `<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
<h1>Users List</h1>
<ul>
<% users.forEach(user => { %>
  <li><%= user.name %> - <%= user.email %></li>
<% }); %>
</ul>
</body>
</html>`
  );

  // user.ejs
  await fs.writeFile(
    path.join(VIEWS_DIR, 'user.ejs'),
    `<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
<h1>User Details</h1>
<p>ID: <%= user.id %></p>
<p>Name: <%= user.name %></p>
<p>Email: <%= user.email %></p>
</body>
</html>`
  );

  // about.ejs
  await fs.writeFile(
    path.join(VIEWS_DIR, 'about.ejs'),
    `<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
<h1>About <%= appName %></h1>
<p>Version: <%= version %></p>
</body>
</html>`
  );

  // result.ejs
  await fs.writeFile(
    path.join(VIEWS_DIR, 'result.ejs'),
    `<!DOCTYPE html>
<html>
<head><title>Form Result</title></head>
<body>
<h1>Form Submitted</h1>
<p>Name: <%= name %></p>
<p>Email: <%= email %></p>
</body>
</html>`
  );

  // error.ejs
  await fs.writeFile(
    path.join(VIEWS_DIR, 'error.ejs'),
    `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body>
<h1>Error</h1>
<p><%= message %></p>
</body>
</html>`
  );
}

async function cleanupTemplates() {
  await fs.rm(VIEWS_DIR, { recursive: true, force: true });
}

// Tests
describe('Exercise 140: Express Template Engines', () => {
  let app;

  beforeAll(async () => {
    await setupTemplates();
    app = createApp();
  });

  afterAll(async () => {
    await cleanupTemplates();
  });

  it('should render home page with title and message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Home Page');
    expect(response.text).toContain('Welcome to Express');
    expect(response.headers['content-type']).toContain('text/html');
  });

  it('should render users list', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Users List');
    expect(response.text).toContain('Alice');
    expect(response.text).toContain('Bob');
    expect(response.text).toContain('alice@example.com');
  });

  it('should render single user details', async () => {
    const response = await request(app).get('/user/1');
    expect(response.status).toBe(200);
    expect(response.text).toContain('User Details');
    expect(response.text).toContain('Alice');
    expect(response.text).toContain('alice@example.com');
  });

  it('should render error page for non-existent user', async () => {
    const response = await request(app).get('/user/999');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Error');
    expect(response.text).toContain('User not found');
  });

  it('should render about page', async () => {
    const response = await request(app).get('/about');
    expect(response.status).toBe(200);
    expect(response.text).toContain('About My App');
    expect(response.text).toContain('Version: 1.0.0');
  });

  it('should handle form submission and render result', async () => {
    const response = await request(app)
      .post('/submit')
      .send('name=John&email=john@example.com')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Form Submitted');
    expect(response.text).toContain('John');
    expect(response.text).toContain('john@example.com');
  });

  it('should still support JSON API endpoints', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveLength(2);
  });
});

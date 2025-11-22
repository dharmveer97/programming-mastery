import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

/**
 * Exercise 191: HTTP Methods - Handling GET, POST, PUT, DELETE
 *
 * HTTP methods (verbs) define the action to be performed:
 * - GET: Retrieve data
 * - POST: Create new data
 * - PUT: Update existing data
 * - DELETE: Remove data
 *
 * Key concepts:
 * - req.method - the HTTP method used
 * - Reading request body for POST/PUT
 * - Different responses for different methods
 *
 * Task: Handle different HTTP methods appropriately
 */

// TODO: Create a server that responds differently based on method
// GET -> "Getting data"
// POST -> "Creating data"
// PUT -> "Updating data"
// DELETE -> "Deleting data"
export function createMethodHandler() {
  // Your code here
  // Hint: Use switch or if/else on req.method
}

// TODO: Create a server that reads POST request body
// POST with body -> echo back the body as JSON
export function createPostBodyReader() {
  // Your code here
  // Hint: Listen to 'data' and 'end' events on req
}

// TODO: Create a simple in-memory store with CRUD operations
// GET /items -> return all items
// POST /items -> add new item (read body)
// PUT /items/:id -> update item (read body)
// DELETE /items/:id -> delete item
export function createCrudServer() {
  const items = [];

  return http.createServer((req, res) => {
    // Your code here
  });
}

// TODO: Create a server that only allows specific methods
// Only allow GET and POST, return 405 for others
export function createMethodFilter() {
  // Your code here
  // Hint: Check req.method and return 405 status for unsupported methods
}

// TODO: Create a server that parses JSON from POST body
// POST with JSON body -> return parsed object with extra field
export function createJsonParser() {
  // Your code here
  // Hint: Collect body chunks, parse JSON, add field, send back
}

// TODO: Create a server with method and route combination
// GET /status -> "OK"
// POST /data -> "Data received"
// PUT /data -> "Data updated"
// DELETE /data -> "Data deleted"
export function createMethodRouteServer() {
  // Your code here
}

// Helper function to make HTTP requests
function makeRequest(port, path = '/', options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port,
      path,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
    req.on('error', reject);
  });
}

// Tests
describe('Exercise 191: HTTP Methods', () => {
  it('should respond differently based on method', async () => {
    const server = createMethodHandler();
    const port = 3201;

    await new Promise(resolve => server.listen(port, resolve));

    const get = await makeRequest(port, '/', { method: 'GET' });
    expect(get.data).toBe('Getting data');

    const post = await makeRequest(port, '/', { method: 'POST' });
    expect(post.data).toBe('Creating data');

    const put = await makeRequest(port, '/', { method: 'PUT' });
    expect(put.data).toBe('Updating data');

    const del = await makeRequest(port, '/', { method: 'DELETE' });
    expect(del.data).toBe('Deleting data');

    server.close();
  });

  it('should read POST request body', async () => {
    const server = createPostBodyReader();
    const port = 3202;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/', {
      method: 'POST',
      body: 'Hello Server',
      headers: { 'Content-Type': 'text/plain' }
    });

    const data = JSON.parse(response.data);
    expect(data.body).toBe('Hello Server');

    server.close();
  });

  it('should handle CRUD operations', async () => {
    const server = createCrudServer();
    const port = 3203;

    await new Promise(resolve => server.listen(port, resolve));

    // Create item
    const create = await makeRequest(port, '/items', {
      method: 'POST',
      body: JSON.stringify({ name: 'Item 1' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const created = JSON.parse(create.data);
    expect(created.name).toBe('Item 1');
    const id = created.id;

    // Get all items
    const getAll = await makeRequest(port, '/items', { method: 'GET' });
    const items = JSON.parse(getAll.data);
    expect(items.length).toBe(1);

    // Update item
    const update = await makeRequest(port, `/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Item' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const updated = JSON.parse(update.data);
    expect(updated.name).toBe('Updated Item');

    // Delete item
    await makeRequest(port, `/items/${id}`, { method: 'DELETE' });
    const afterDelete = await makeRequest(port, '/items', { method: 'GET' });
    const afterItems = JSON.parse(afterDelete.data);
    expect(afterItems.length).toBe(0);

    server.close();
  });

  it('should filter allowed methods', async () => {
    const server = createMethodFilter();
    const port = 3204;

    await new Promise(resolve => server.listen(port, resolve));

    const get = await makeRequest(port, '/', { method: 'GET' });
    expect(get.statusCode).toBe(200);

    const post = await makeRequest(port, '/', { method: 'POST' });
    expect(post.statusCode).toBe(200);

    const put = await makeRequest(port, '/', { method: 'PUT' });
    expect(put.statusCode).toBe(405);

    server.close();
  });

  it('should parse JSON from POST body', async () => {
    const server = createJsonParser();
    const port = 3205;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', age: 30 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = JSON.parse(response.data);
    expect(data.name).toBe('Alice');
    expect(data.age).toBe(30);
    expect(data.processed).toBe(true);

    server.close();
  });

  it('should handle method and route combinations', async () => {
    const server = createMethodRouteServer();
    const port = 3206;

    await new Promise(resolve => server.listen(port, resolve));

    const status = await makeRequest(port, '/status', { method: 'GET' });
    expect(status.data).toBe('OK');

    const post = await makeRequest(port, '/data', { method: 'POST' });
    expect(post.data).toBe('Data received');

    const put = await makeRequest(port, '/data', { method: 'PUT' });
    expect(put.data).toBe('Data updated');

    const del = await makeRequest(port, '/data', { method: 'DELETE' });
    expect(del.data).toBe('Data deleted');

    server.close();
  });
});

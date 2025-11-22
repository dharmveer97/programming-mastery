import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

/**
 * Exercise 191: HTTP Methods - Handling GET, POST, PUT, DELETE - SOLUTION
 */

export function createMethodHandler() {
  return http.createServer((req, res) => {
    switch (req.method) {
      case 'GET':
        res.end('Getting data');
        break;
      case 'POST':
        res.end('Creating data');
        break;
      case 'PUT':
        res.end('Updating data');
        break;
      case 'DELETE':
        res.end('Deleting data');
        break;
      default:
        res.statusCode = 405;
        res.end('Method not allowed');
    }
  });
}

export function createPostBodyReader() {
  return http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ body }));
    });
  });
}

export function createCrudServer() {
  const items = [];
  let nextId = 1;

  return http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    // GET /items
    if (method === 'GET' && url === '/items') {
      res.end(JSON.stringify(items));
      return;
    }

    // POST /items
    if (method === 'POST' && url === '/items') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        const item = JSON.parse(body);
        item.id = nextId++;
        items.push(item);
        res.end(JSON.stringify(item));
      });
      return;
    }

    // PUT /items/:id
    if (method === 'PUT' && url.startsWith('/items/')) {
      const id = parseInt(url.split('/')[2]);
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        const updates = JSON.parse(body);
        const item = items.find(i => i.id === id);
        if (item) {
          Object.assign(item, updates);
          res.end(JSON.stringify(item));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      });
      return;
    }

    // DELETE /items/:id
    if (method === 'DELETE' && url.startsWith('/items/')) {
      const id = parseInt(url.split('/')[2]);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items.splice(index, 1);
        res.end(JSON.stringify({ success: true }));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
      }
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  });
}

export function createMethodFilter() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' || req.method === 'POST') {
      res.statusCode = 200;
      res.end('Method allowed');
    } else {
      res.statusCode = 405;
      res.end('Method not allowed');
    }
  });
}

export function createJsonParser() {
  return http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const data = JSON.parse(body);
      data.processed = true;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    });
  });
}

export function createMethodRouteServer() {
  return http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;

    if (method === 'GET' && url === '/status') {
      res.end('OK');
    } else if (method === 'POST' && url === '/data') {
      res.end('Data received');
    } else if (method === 'PUT' && url === '/data') {
      res.end('Data updated');
    } else if (method === 'DELETE' && url === '/data') {
      res.end('Data deleted');
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
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
describe('Exercise 191: HTTP Methods - Solution', () => {
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

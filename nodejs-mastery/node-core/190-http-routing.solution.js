import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { URL } from 'url';

/**
 * Exercise 190: HTTP Routing - Routing with Raw HTTP Module - SOLUTION
 */

export function createBasicRouter() {
  return http.createServer((req, res) => {
    if (req.url === '/home') {
      res.end('Welcome Home');
    } else if (req.url === '/about') {
      res.end('About Us');
    } else {
      res.end('404 Not Found');
    }
  });
}

export function createQueryParamServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const query = url.searchParams.get('q');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ query }));
  });
}

export function createRestRouter() {
  return http.createServer((req, res) => {
    if (req.url === '/api/users') {
      res.end('List of users');
    } else if (req.url.startsWith('/api/users/')) {
      const userId = req.url.split('/')[3];
      res.end(`User ${userId}`);
    } else if (req.url === '/api/products') {
      res.end('List of products');
    } else {
      res.end('404 Not Found');
    }
  });
}

export function createPathParamServer() {
  return http.createServer((req, res) => {
    const parts = req.url.split('/');
    if (parts[1] === 'user' && parts[2]) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ name: parts[2] }));
    } else {
      res.end('404 Not Found');
    }
  });
}

export function createCalculatorServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const a = parseInt(url.searchParams.get('a'));
    const b = parseInt(url.searchParams.get('b'));
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ a, b, sum: a + b }));
  });
}

export function createVersionedApiServer() {
  return http.createServer((req, res) => {
    if (req.url === '/api/v1/users') {
      res.end('API v1 Users');
    } else if (req.url === '/api/v2/users') {
      res.end('API v2 Users');
    } else {
      res.end('404 Not Found');
    }
  });
}

// Helper function to make HTTP request
function makeRequest(port, path = '/') {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

// Tests
describe('Exercise 190: HTTP Routing - Solution', () => {
  it('should route to different paths', async () => {
    const server = createBasicRouter();
    const port = 3101;

    await new Promise(resolve => server.listen(port, resolve));

    const home = await makeRequest(port, '/home');
    expect(home.data).toBe('Welcome Home');

    const about = await makeRequest(port, '/about');
    expect(about.data).toBe('About Us');

    const notFound = await makeRequest(port, '/random');
    expect(notFound.data).toBe('404 Not Found');

    server.close();
  });

  it('should parse query parameters', async () => {
    const server = createQueryParamServer();
    const port = 3102;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/search?q=hello');
    const data = JSON.parse(response.data);
    expect(data.query).toBe('hello');

    server.close();
  });

  it('should handle RESTful routes', async () => {
    const server = createRestRouter();
    const port = 3103;

    await new Promise(resolve => server.listen(port, resolve));

    const users = await makeRequest(port, '/api/users');
    expect(users.data).toBe('List of users');

    const user = await makeRequest(port, '/api/users/123');
    expect(user.data).toBe('User 123');

    const products = await makeRequest(port, '/api/products');
    expect(products.data).toBe('List of products');

    server.close();
  });

  it('should extract path parameters', async () => {
    const server = createPathParamServer();
    const port = 3104;

    await new Promise(resolve => server.listen(port, resolve));

    const alice = await makeRequest(port, '/user/alice');
    const aliceData = JSON.parse(alice.data);
    expect(aliceData.name).toBe('alice');

    const bob = await makeRequest(port, '/user/bob');
    const bobData = JSON.parse(bob.data);
    expect(bobData.name).toBe('bob');

    server.close();
  });

  it('should handle multiple query parameters', async () => {
    const server = createCalculatorServer();
    const port = 3105;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/calculate?a=5&b=3');
    const data = JSON.parse(response.data);
    expect(data.a).toBe(5);
    expect(data.b).toBe(3);
    expect(data.sum).toBe(8);

    server.close();
  });

  it('should handle versioned API routes', async () => {
    const server = createVersionedApiServer();
    const port = 3106;

    await new Promise(resolve => server.listen(port, resolve));

    const v1 = await makeRequest(port, '/api/v1/users');
    expect(v1.data).toBe('API v1 Users');

    const v2 = await makeRequest(port, '/api/v2/users');
    expect(v2.data).toBe('API v2 Users');

    server.close();
  });
});

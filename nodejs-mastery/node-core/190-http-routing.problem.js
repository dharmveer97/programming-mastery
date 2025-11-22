import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { URL } from 'url';

/**
 * Exercise 190: HTTP Routing - Routing with Raw HTTP Module
 *
 * Routing means handling different URLs/paths differently.
 * Use req.url to get the path and route requests accordingly.
 *
 * Key concepts:
 * - req.url - the requested URL path
 * - URL parsing - extracting path and query parameters
 * - Conditional routing - different responses for different paths
 *
 * Task: Create servers with routing capabilities
 */

// TODO: Create a server with basic routing
// /home -> "Welcome Home"
// /about -> "About Us"
// other -> "404 Not Found"
export function createBasicRouter() {
  // Your code here
  // Hint: Use if/else or switch on req.url
}

// TODO: Create a server that parses query parameters
// /search?q=hello -> { query: 'hello' }
export function createQueryParamServer() {
  // Your code here
  // Hint: Use URL class - new URL(req.url, 'http://localhost')
}

// TODO: Create a server with RESTful routes
// /api/users -> "List of users"
// /api/users/123 -> "User 123"
// /api/products -> "List of products"
export function createRestRouter() {
  // Your code here
  // Hint: Check if url starts with certain path
}

// TODO: Create a server that extracts path parameters
// /user/alice -> { name: 'alice' }
// /user/bob -> { name: 'bob' }
export function createPathParamServer() {
  // Your code here
  // Hint: Split url by '/' and extract parts
}

// TODO: Create a server with multiple query parameters
// /calculate?a=5&b=3 -> { a: 5, b: 3, sum: 8 }
export function createCalculatorServer() {
  // Your code here
  // Hint: Use URL.searchParams.get()
}

// TODO: Create a server with nested routes
// /api/v1/users -> "API v1 Users"
// /api/v2/users -> "API v2 Users"
export function createVersionedApiServer() {
  // Your code here
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
describe('Exercise 190: HTTP Routing', () => {
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

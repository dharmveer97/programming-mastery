import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

/**
 * Exercise 189: HTTP Basics - Creating Basic HTTP Server - SOLUTION
 */

export function createHelloServer() {
  return http.createServer((req, res) => {
    res.end('Hello, World!');
  });
}

export function createEchoUrlServer() {
  return http.createServer((req, res) => {
    res.end(req.url);
  });
}

export function createJsonServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Hello, JSON!' }));
  });
}

export function createHtmlServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>Hello, HTML!</h1></body></html>');
  });
}

export function createNotFoundServer() {
  return http.createServer((req, res) => {
    res.statusCode = 404;
    res.end('Not Found');
  });
}

export function createMethodServer() {
  return http.createServer((req, res) => {
    res.end(req.method);
  });
}

// Helper function to make HTTP request
function makeRequest(port, path = '/') {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

// Tests
describe('Exercise 189: HTTP Basics - Solution', () => {
  it('should create server that responds with "Hello, World!"', async () => {
    const server = createHelloServer();
    const port = 3001;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.data).toBe('Hello, World!');

    server.close();
  });

  it('should echo the requested URL', async () => {
    const server = createEchoUrlServer();
    const port = 3002;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/test/path');
    expect(response.data).toBe('/test/path');

    server.close();
  });

  it('should respond with JSON', async () => {
    const server = createJsonServer();
    const port = 3003;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.headers['content-type']).toContain('application/json');
    const data = JSON.parse(response.data);
    expect(data).toHaveProperty('message');

    server.close();
  });

  it('should respond with HTML', async () => {
    const server = createHtmlServer();
    const port = 3004;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.data).toContain('<html>');

    server.close();
  });

  it('should respond with 404 status code', async () => {
    const server = createNotFoundServer();
    const port = 3005;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.statusCode).toBe(404);

    server.close();
  });

  it('should read request method', async () => {
    const server = createMethodServer();
    const port = 3006;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.data).toBe('GET');

    server.close();
  });
});

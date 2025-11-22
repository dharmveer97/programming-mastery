import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

/**
 * Exercise 189: HTTP Basics - Creating Basic HTTP Server
 *
 * The http module allows you to create HTTP servers and clients.
 * A server listens for requests and sends responses.
 *
 * Key concepts:
 * - http.createServer(requestListener) - creates HTTP server
 * - server.listen(port, callback) - starts listening on a port
 * - request object - contains info about client request
 * - response object - used to send data back to client
 *
 * Task: Create basic HTTP servers and handle requests/responses
 */

// TODO: Create a server that responds with "Hello, World!"
export function createHelloServer() {
  // Your code here
  // Hint: Use http.createServer() and res.end()
}

// TODO: Create a server that responds with request URL
export function createEchoUrlServer() {
  // Your code here
  // Hint: Use req.url to get the requested URL
}

// TODO: Create a server that responds with JSON
export function createJsonServer() {
  // Your code here
  // Hint: Use res.setHeader() and JSON.stringify()
}

// TODO: Create a server that responds with HTML
export function createHtmlServer() {
  // Your code here
  // Hint: Set content-type to 'text/html'
}

// TODO: Create a server that responds with status code 404
export function createNotFoundServer() {
  // Your code here
  // Hint: Use res.statusCode or res.writeHead()
}

// TODO: Create a server that reads request method
export function createMethodServer() {
  // Your code here
  // Hint: Use req.method
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
describe('Exercise 189: HTTP Basics', () => {
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

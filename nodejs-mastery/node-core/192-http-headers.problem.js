import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

/**
 * Exercise 192: HTTP Headers - Setting and Reading Headers
 *
 * Headers provide metadata about the HTTP request/response.
 * Common headers include Content-Type, Authorization, Cache-Control, etc.
 *
 * Key concepts:
 * - res.setHeader(name, value) - sets a response header
 * - res.writeHead(statusCode, headers) - sets status and headers
 * - req.headers - object containing request headers
 * - Content-Type - specifies the media type of the resource
 *
 * Task: Work with HTTP headers effectively
 */

// TODO: Create a server that sets multiple response headers
// Set Content-Type, X-Custom-Header, Cache-Control
export function createHeaderServer() {
  // Your code here
  // Hint: Use res.setHeader() or res.writeHead()
}

// TODO: Create a server that reads request headers
// Return the User-Agent header from the request
export function createUserAgentReader() {
  // Your code here
  // Hint: Access req.headers['user-agent']
}

// TODO: Create a server that sets different Content-Type
// /json -> application/json
// /html -> text/html
// /text -> text/plain
export function createContentTypeServer() {
  // Your code here
}

// TODO: Create a server that reads custom headers
// Read X-API-Key header and validate it
// Return 401 if key is not "secret123"
export function createAuthServer() {
  // Your code here
  // Hint: Check req.headers['x-api-key']
}

// TODO: Create a server that sets CORS headers
// Set Access-Control-Allow-Origin and other CORS headers
export function createCorsServer() {
  // Your code here
  // Hint: Set Access-Control-Allow-Origin, Methods, Headers
}

// TODO: Create a server that sets cache headers
// /static -> Cache-Control: max-age=3600
// /dynamic -> Cache-Control: no-cache
export function createCacheServer() {
  // Your code here
}

// TODO: Create a server that reads and echoes all headers
// Return all request headers as JSON
export function createHeaderEchoServer() {
  // Your code here
}

// TODO: Create a server that sets custom response headers
// Set X-Response-Time, X-Powered-By, X-Request-Id
export function createCustomHeaderServer() {
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
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        data
      }));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
    req.on('error', reject);
  });
}

// Tests
describe('Exercise 192: HTTP Headers', () => {
  it('should set multiple response headers', async () => {
    const server = createHeaderServer();
    const port = 3301;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.headers['x-custom-header']).toBe('CustomValue');
    expect(response.headers['cache-control']).toBeTruthy();

    server.close();
  });

  it('should read User-Agent header', async () => {
    const server = createUserAgentReader();
    const port = 3302;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/', {
      headers: { 'User-Agent': 'MyTestClient/1.0' }
    });
    expect(response.data).toContain('MyTestClient/1.0');

    server.close();
  });

  it('should set different Content-Type for different routes', async () => {
    const server = createContentTypeServer();
    const port = 3303;

    await new Promise(resolve => server.listen(port, resolve));

    const json = await makeRequest(port, '/json');
    expect(json.headers['content-type']).toContain('application/json');

    const html = await makeRequest(port, '/html');
    expect(html.headers['content-type']).toContain('text/html');

    const text = await makeRequest(port, '/text');
    expect(text.headers['content-type']).toContain('text/plain');

    server.close();
  });

  it('should validate custom authentication header', async () => {
    const server = createAuthServer();
    const port = 3304;

    await new Promise(resolve => server.listen(port, resolve));

    const unauthorized = await makeRequest(port);
    expect(unauthorized.statusCode).toBe(401);

    const wrongKey = await makeRequest(port, '/', {
      headers: { 'X-API-Key': 'wrong' }
    });
    expect(wrongKey.statusCode).toBe(401);

    const authorized = await makeRequest(port, '/', {
      headers: { 'X-API-Key': 'secret123' }
    });
    expect(authorized.statusCode).toBe(200);

    server.close();
  });

  it('should set CORS headers', async () => {
    const server = createCorsServer();
    const port = 3305;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.headers['access-control-allow-origin']).toBeTruthy();
    expect(response.headers['access-control-allow-methods']).toBeTruthy();
    expect(response.headers['access-control-allow-headers']).toBeTruthy();

    server.close();
  });

  it('should set cache headers based on route', async () => {
    const server = createCacheServer();
    const port = 3306;

    await new Promise(resolve => server.listen(port, resolve));

    const staticRoute = await makeRequest(port, '/static');
    expect(staticRoute.headers['cache-control']).toContain('max-age=3600');

    const dynamicRoute = await makeRequest(port, '/dynamic');
    expect(dynamicRoute.headers['cache-control']).toContain('no-cache');

    server.close();
  });

  it('should echo all request headers', async () => {
    const server = createHeaderEchoServer();
    const port = 3307;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port, '/', {
      headers: {
        'X-Custom-1': 'Value1',
        'X-Custom-2': 'Value2'
      }
    });

    const headers = JSON.parse(response.data);
    expect(headers['x-custom-1']).toBe('Value1');
    expect(headers['x-custom-2']).toBe('Value2');

    server.close();
  });

  it('should set custom response headers', async () => {
    const server = createCustomHeaderServer();
    const port = 3308;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeRequest(port);
    expect(response.headers['x-response-time']).toBeTruthy();
    expect(response.headers['x-powered-by']).toBeTruthy();
    expect(response.headers['x-request-id']).toBeTruthy();

    server.close();
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

/**
 * Exercise 192: HTTP Headers - Setting and Reading Headers - SOLUTION
 */

export function createHeaderServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('X-Custom-Header', 'CustomValue');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.end('Headers set!');
  });
}

export function createUserAgentReader() {
  return http.createServer((req, res) => {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    res.end(`User-Agent: ${userAgent}`);
  });
}

export function createContentTypeServer() {
  return http.createServer((req, res) => {
    if (req.url === '/json') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'JSON response' }));
    } else if (req.url === '/html') {
      res.setHeader('Content-Type', 'text/html');
      res.end('<html><body><h1>HTML response</h1></body></html>');
    } else if (req.url === '/text') {
      res.setHeader('Content-Type', 'text/plain');
      res.end('Text response');
    } else {
      res.end('OK');
    }
  });
}

export function createAuthServer() {
  return http.createServer((req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === 'secret123') {
      res.statusCode = 200;
      res.end('Authorized');
    } else {
      res.statusCode = 401;
      res.end('Unauthorized');
    }
  });
}

export function createCorsServer() {
  return http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end('CORS enabled');
  });
}

export function createCacheServer() {
  return http.createServer((req, res) => {
    if (req.url === '/static') {
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.end('Static content');
    } else if (req.url === '/dynamic') {
      res.setHeader('Cache-Control', 'no-cache');
      res.end('Dynamic content');
    } else {
      res.end('OK');
    }
  });
}

export function createHeaderEchoServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.headers));
  });
}

export function createCustomHeaderServer() {
  return http.createServer((req, res) => {
    res.setHeader('X-Response-Time', Date.now().toString());
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('X-Request-Id', Math.random().toString(36).substr(2, 9));
    res.end('Custom headers set');
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
describe('Exercise 192: HTTP Headers - Solution', () => {
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

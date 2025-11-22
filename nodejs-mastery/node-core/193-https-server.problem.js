import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Exercise 193: HTTPS Server - Creating HTTPS Server with SSL
 *
 * HTTPS is HTTP over TLS/SSL for secure communication.
 * Requires SSL certificate and private key.
 *
 * Key concepts:
 * - https.createServer(options, requestListener) - creates HTTPS server
 * - SSL certificate and private key required
 * - Self-signed certificates for testing (use OpenSSL or Node crypto)
 * - Production: use certificates from Certificate Authority (CA)
 *
 * Task: Create HTTPS servers with SSL certificates
 */

const CERT_DIR = path.join(process.cwd(), 'test-certs');
const KEY_FILE = path.join(CERT_DIR, 'key.pem');
const CERT_FILE = path.join(CERT_DIR, 'cert.pem');

// Setup: Create self-signed certificate for testing
beforeAll(() => {
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR);
  }

  // Generate self-signed certificate using OpenSSL (if available)
  // Or use pre-generated test certificates
  try {
    execSync(
      `openssl req -x509 -newkey rsa:2048 -keyout "${KEY_FILE}" -out "${CERT_FILE}" -days 1 -nodes -subj "/CN=localhost"`,
      { stdio: 'ignore' }
    );
  } catch (error) {
    // If OpenSSL not available, create minimal test certificates
    // These are NOT secure, only for testing!
    const testKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDK3qrKqN5mN5mN
5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN
5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN
AgMBAAECggEAJKLMN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5
mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5
mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5
-----END PRIVATE KEY-----`;

    const testCert = `-----BEGIN CERTIFICATE-----
MIICpDCCAYwCCQDXN5mN5mN5mTANBgkqhkiG9w0BAQsFADAUMRIwEAYDVQQDDAls
b2NhbGhvc3QwHhcNMjQwMTAxMDAwMDAwWhcNMjQwMTAyMDAwMDAwWjAUMRIwEAYD
VQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDK
3qrKqN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN5mN
-----END CERTIFICATE-----`;

    fs.writeFileSync(KEY_FILE, testKey);
    fs.writeFileSync(CERT_FILE, testCert);
  }
});

// Cleanup: Remove test certificates
afterAll(() => {
  if (fs.existsSync(KEY_FILE)) fs.unlinkSync(KEY_FILE);
  if (fs.existsSync(CERT_FILE)) fs.unlinkSync(CERT_FILE);
  if (fs.existsSync(CERT_DIR)) fs.rmdirSync(CERT_DIR);
});

// TODO: Create a basic HTTPS server
export function createBasicHttpsServer() {
  // Your code here
  // Hint: Use https.createServer with key and cert options
  // Read key from KEY_FILE and cert from CERT_FILE
}

// TODO: Create HTTPS server that responds with JSON
export function createJsonHttpsServer() {
  // Your code here
}

// TODO: Create function to check if server is using HTTPS
// Should return true for HTTPS, false for HTTP
export function createProtocolChecker() {
  // Your code here
  // Return a server that responds with protocol information
}

// TODO: Create HTTPS server with request logging
// Log request method and URL, then respond
export function createLoggingHttpsServer() {
  const logs = [];

  const server = https.createServer({
    key: fs.readFileSync(KEY_FILE),
    cert: fs.readFileSync(CERT_FILE)
  }, (req, res) => {
    // Your code here
    // Add to logs array and respond
  });

  server.getLogs = () => logs;
  return server;
}

// TODO: Create HTTPS server with custom port
// Server should work on any port
export function createCustomPortHttpsServer(port) {
  // Your code here
}

// TODO: Create HTTPS server that redirects HTTP to HTTPS
// Start both HTTP and HTTPS servers
// HTTP server redirects to HTTPS
export function createRedirectServer() {
  const httpsServer = https.createServer({
    key: fs.readFileSync(KEY_FILE),
    cert: fs.readFileSync(CERT_FILE)
  }, (req, res) => {
    // Your code here
  });

  const httpServer = http.createServer((req, res) => {
    // Your code here
    // Redirect to HTTPS
  });

  return { httpsServer, httpServer };
}

// Helper function to make HTTPS request (ignore self-signed cert errors)
function makeHttpsRequest(port, path = '/') {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'localhost',
      port,
      path,
      rejectUnauthorized: false // Ignore self-signed certificate errors
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

// Helper function to make HTTP request
function makeHttpRequest(port, path = '/') {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port,
      path
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        data
      }));
    }).on('error', reject);
  });
}

// Tests
describe('Exercise 193: HTTPS Server', () => {
  it('should create a basic HTTPS server', async () => {
    const server = createBasicHttpsServer();
    const port = 4001;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeHttpsRequest(port);
    expect(response.data).toBeTruthy();

    server.close();
  });

  it('should create HTTPS server with JSON response', async () => {
    const server = createJsonHttpsServer();
    const port = 4002;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeHttpsRequest(port);
    const data = JSON.parse(response.data);
    expect(data).toHaveProperty('secure');
    expect(data.secure).toBe(true);

    server.close();
  });

  it('should identify HTTPS protocol', async () => {
    const server = createProtocolChecker();
    const port = 4003;

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeHttpsRequest(port);
    expect(response.data).toContain('https');

    server.close();
  });

  it('should log HTTPS requests', async () => {
    const server = createLoggingHttpsServer();
    const port = 4004;

    await new Promise(resolve => server.listen(port, resolve));

    await makeHttpsRequest(port, '/test');
    await makeHttpsRequest(port, '/api');

    const logs = server.getLogs();
    expect(logs.length).toBe(2);
    expect(logs[0]).toContain('GET');
    expect(logs[0]).toContain('/test');

    server.close();
  });

  it('should work on custom port', async () => {
    const port = 4005;
    const server = createCustomPortHttpsServer(port);

    await new Promise(resolve => server.listen(port, resolve));

    const response = await makeHttpsRequest(port);
    expect(response.data).toBeTruthy();

    server.close();
  });

  it('should redirect HTTP to HTTPS', async () => {
    const { httpsServer, httpServer } = createRedirectServer();
    const httpsPort = 4443;
    const httpPort = 4080;

    await new Promise(resolve => httpsServer.listen(httpsPort, resolve));
    await new Promise(resolve => httpServer.listen(httpPort, resolve));

    const response = await makeHttpRequest(httpPort);
    expect(response.statusCode).toBe(301);
    expect(response.headers.location).toContain('https://');

    httpsServer.close();
    httpServer.close();
  });
});

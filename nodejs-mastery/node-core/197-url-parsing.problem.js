import { describe, it, expect } from 'vitest';

/**
 * Exercise 197: URL Parsing with URL Class
 *
 * Node.js provides the URL class (WHATWG URL API) for parsing and working with URLs.
 * This is the modern way to handle URLs (url.parse is deprecated).
 *
 * Key URL components:
 * - protocol: 'https:'
 * - hostname: 'example.com'
 * - port: '8080'
 * - pathname: '/path/to/page'
 * - search: '?key=value'
 * - hash: '#section'
 * - origin: 'https://example.com:8080'
 * - href: full URL string
 *
 * Creating URLs:
 * - new URL(urlString)
 * - new URL(path, baseURL)
 *
 * Task: Work with the URL class to parse and manipulate URLs
 */

// TODO: Parse a URL and extract its hostname
// Example: 'https://www.example.com/path' -> 'www.example.com'
export function getHostname(urlString) {
  // Your code here
}

// TODO: Parse a URL and extract its pathname
// Example: 'https://example.com/api/users' -> '/api/users'
export function getPathname(urlString) {
  // Your code here
}

// TODO: Get the protocol from a URL (without the colon)
// Example: 'https://example.com' -> 'https'
export function getProtocol(urlString) {
  // Your code here
}

// TODO: Extract port from URL, return default ports (80 for http, 443 for https) if not specified
// Example: 'https://example.com:8080' -> '8080'
// Example: 'https://example.com' -> '443'
export function getPortWithDefault(urlString) {
  // Your code here
}

// TODO: Combine a base URL with a relative path
// Example: base='https://api.example.com', path='/users/123' -> 'https://api.example.com/users/123'
export function combineUrl(baseUrl, relativePath) {
  // Your code here
}

// TODO: Check if a URL uses HTTPS protocol
export function isSecureUrl(urlString) {
  // Your code here
}

// TODO: Extract the origin (protocol + hostname + port) from a URL
// Example: 'https://example.com:8080/path?query=1' -> 'https://example.com:8080'
export function getOrigin(urlString) {
  // Your code here
}

// TODO: Parse a URL and return an object with all main components
// Return object should have: protocol, hostname, port, pathname, search, hash
export function parseUrlComponents(urlString) {
  // Your code here
}

// Tests
describe('Exercise 197: URL Parsing', () => {
  it('should extract hostname from URL', () => {
    expect(getHostname('https://www.example.com/path')).toBe('www.example.com');
    expect(getHostname('http://api.github.com/users')).toBe('api.github.com');
  });

  it('should extract pathname from URL', () => {
    expect(getPathname('https://example.com/api/users')).toBe('/api/users');
    expect(getPathname('https://example.com/')).toBe('/');
    expect(getPathname('https://example.com')).toBe('/');
  });

  it('should extract protocol without colon', () => {
    expect(getProtocol('https://example.com')).toBe('https');
    expect(getProtocol('http://example.com')).toBe('http');
    expect(getProtocol('ftp://files.example.com')).toBe('ftp');
  });

  it('should get port with defaults', () => {
    expect(getPortWithDefault('https://example.com:8080')).toBe('8080');
    expect(getPortWithDefault('https://example.com')).toBe('443');
    expect(getPortWithDefault('http://example.com')).toBe('80');
    expect(getPortWithDefault('http://example.com:3000')).toBe('3000');
  });

  it('should combine base URL with relative path', () => {
    expect(combineUrl('https://api.example.com', '/users/123'))
      .toBe('https://api.example.com/users/123');
    expect(combineUrl('https://example.com/api', '../admin'))
      .toBe('https://example.com/admin');
  });

  it('should check if URL is secure (HTTPS)', () => {
    expect(isSecureUrl('https://example.com')).toBe(true);
    expect(isSecureUrl('http://example.com')).toBe(false);
    expect(isSecureUrl('ftp://files.example.com')).toBe(false);
  });

  it('should extract origin from URL', () => {
    expect(getOrigin('https://example.com:8080/path?query=1'))
      .toBe('https://example.com:8080');
    expect(getOrigin('https://example.com/path'))
      .toBe('https://example.com');
    expect(getOrigin('http://localhost:3000/api'))
      .toBe('http://localhost:3000');
  });

  it('should parse all URL components', () => {
    const components = parseUrlComponents('https://example.com:8080/path/to/page?foo=bar&baz=qux#section');

    expect(components.protocol).toBe('https:');
    expect(components.hostname).toBe('example.com');
    expect(components.port).toBe('8080');
    expect(components.pathname).toBe('/path/to/page');
    expect(components.search).toBe('?foo=bar&baz=qux');
    expect(components.hash).toBe('#section');
  });
});

import { describe, it, expect } from 'vitest';

/**
 * Exercise 197: URL Parsing with URL Class - SOLUTION
 */

export function getHostname(urlString) {
  const url = new URL(urlString);
  return url.hostname;
}

export function getPathname(urlString) {
  const url = new URL(urlString);
  return url.pathname;
}

export function getProtocol(urlString) {
  const url = new URL(urlString);
  // Remove the trailing colon from protocol
  return url.protocol.slice(0, -1);
}

export function getPortWithDefault(urlString) {
  const url = new URL(urlString);

  // If port is explicitly set, return it
  if (url.port) {
    return url.port;
  }

  // Return default ports based on protocol
  if (url.protocol === 'https:') {
    return '443';
  } else if (url.protocol === 'http:') {
    return '80';
  }

  return '';
}

export function combineUrl(baseUrl, relativePath) {
  const url = new URL(relativePath, baseUrl);
  return url.href;
}

export function isSecureUrl(urlString) {
  const url = new URL(urlString);
  return url.protocol === 'https:';
}

export function getOrigin(urlString) {
  const url = new URL(urlString);
  return url.origin;
}

export function parseUrlComponents(urlString) {
  const url = new URL(urlString);

  return {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash
  };
}

// Tests
describe('Exercise 197: URL Parsing - Solution', () => {
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

import { describe, it, expect } from 'vitest';

/**
 * Exercise 198: URLSearchParams - Query String Manipulation - SOLUTION
 */

export function getQueryParam(urlString, paramName) {
  const url = new URL(urlString);
  return url.searchParams.get(paramName);
}

export function getAllQueryParams(queryString, paramName) {
  const params = new URLSearchParams(queryString);
  return params.getAll(paramName);
}

export function hasQueryParam(urlString, paramName) {
  const url = new URL(urlString);
  return url.searchParams.has(paramName);
}

export function addQueryParam(urlString, paramName, paramValue) {
  const url = new URL(urlString);
  url.searchParams.append(paramName, paramValue);
  return url.href;
}

export function updateQueryParam(urlString, paramName, paramValue) {
  const url = new URL(urlString);
  url.searchParams.set(paramName, paramValue);
  return url.href;
}

export function removeQueryParam(urlString, paramName) {
  const url = new URL(urlString);
  url.searchParams.delete(paramName);
  return url.href;
}

export function objectToQueryString(obj) {
  const params = new URLSearchParams(obj);
  return params.toString();
}

export function queryStringToObject(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  const processedKeys = new Set();

  for (const [key] of params.entries()) {
    // Skip if we've already processed this key
    if (processedKeys.has(key)) {
      continue;
    }

    // Mark this key as processed
    processedKeys.add(key);

    // Get all values for this key
    const allValues = params.getAll(key);

    // If multiple values, use array; otherwise use single value
    if (allValues.length > 1) {
      result[key] = allValues;
    } else {
      result[key] = allValues[0];
    }
  }

  return result;
}

// Tests
describe('Exercise 198: URLSearchParams - Solution', () => {
  it('should get a specific query parameter', () => {
    expect(getQueryParam('https://example.com?name=John&age=30', 'name')).toBe('John');
    expect(getQueryParam('https://example.com?name=John&age=30', 'age')).toBe('30');
    expect(getQueryParam('https://example.com?name=John', 'age')).toBe(null);
  });

  it('should get all values for a query parameter', () => {
    expect(getAllQueryParams('?tag=js&tag=node&tag=web', 'tag'))
      .toEqual(['js', 'node', 'web']);
    expect(getAllQueryParams('?name=John', 'tag'))
      .toEqual([]);
  });

  it('should check if URL has query parameter', () => {
    expect(hasQueryParam('https://example.com?name=John&age=30', 'name')).toBe(true);
    expect(hasQueryParam('https://example.com?name=John&age=30', 'city')).toBe(false);
  });

  it('should add query parameter to URL', () => {
    const result = addQueryParam('https://example.com?foo=bar', 'baz', 'qux');
    expect(result).toBe('https://example.com/?foo=bar&baz=qux');
  });

  it('should update existing query parameter', () => {
    const result = updateQueryParam('https://example.com?page=1&limit=10', 'page', '2');
    expect(result).toBe('https://example.com/?page=2&limit=10');
  });

  it('should add query parameter if it does not exist when updating', () => {
    const result = updateQueryParam('https://example.com?page=1', 'limit', '10');
    expect(result).toBe('https://example.com/?page=1&limit=10');
  });

  it('should remove query parameter from URL', () => {
    const result = removeQueryParam('https://example.com?foo=bar&baz=qux', 'foo');
    expect(result).toBe('https://example.com/?baz=qux');
  });

  it('should convert object to query string', () => {
    const result = objectToQueryString({ name: 'John', age: '30', city: 'NYC' });
    expect(result).toBe('name=John&age=30&city=NYC');
  });

  it('should handle empty object', () => {
    expect(objectToQueryString({})).toBe('');
  });

  it('should parse query string to object', () => {
    const result = queryStringToObject('name=John&age=30&tag=js&tag=node');
    expect(result).toEqual({
      name: 'John',
      age: '30',
      tag: ['js', 'node']
    });
  });

  it('should handle query string with single values', () => {
    const result = queryStringToObject('name=John&age=30');
    expect(result).toEqual({
      name: 'John',
      age: '30'
    });
  });

  it('should handle empty query string', () => {
    expect(queryStringToObject('')).toEqual({});
  });
});

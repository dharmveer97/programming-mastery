import { describe, it, expect } from 'vitest';

/**
 * Exercise 198: URLSearchParams - Query String Manipulation
 *
 * URLSearchParams is a built-in API for working with URL query strings.
 * It provides methods to read, add, update, and delete query parameters.
 *
 * Key methods:
 * - get(name) - get first value for parameter
 * - getAll(name) - get all values for parameter
 * - has(name) - check if parameter exists
 * - set(name, value) - set parameter value
 * - append(name, value) - add parameter (allows duplicates)
 * - delete(name) - remove parameter
 * - toString() - convert to query string
 * - entries() - get iterator of [key, value] pairs
 *
 * Creating URLSearchParams:
 * - new URLSearchParams(queryString)
 * - new URLSearchParams(object)
 * - url.searchParams (from URL object)
 *
 * Task: Work with URLSearchParams to manipulate query strings
 */

// TODO: Extract a specific query parameter value from a URL
// Example: url='https://example.com?name=John&age=30', param='name' -> 'John'
export function getQueryParam(urlString, paramName) {
  // Your code here
}

// TODO: Get all values for a query parameter (handles multiple values with same name)
// Example: '?tag=js&tag=node&tag=web', param='tag' -> ['js', 'node', 'web']
export function getAllQueryParams(queryString, paramName) {
  // Your code here
}

// TODO: Check if a URL has a specific query parameter
export function hasQueryParam(urlString, paramName) {
  // Your code here
}

// TODO: Add a new query parameter to a URL (preserve existing params)
// Example: url='https://example.com?foo=bar', param='baz', value='qux'
//          -> 'https://example.com?foo=bar&baz=qux'
export function addQueryParam(urlString, paramName, paramValue) {
  // Your code here
}

// TODO: Update an existing query parameter value (or add if doesn't exist)
// Example: url='https://example.com?page=1', param='page', value='2'
//          -> 'https://example.com?page=2'
export function updateQueryParam(urlString, paramName, paramValue) {
  // Your code here
}

// TODO: Remove a query parameter from a URL
// Example: url='https://example.com?foo=bar&baz=qux', param='foo'
//          -> 'https://example.com?baz=qux'
export function removeQueryParam(urlString, paramName) {
  // Your code here
}

// TODO: Convert an object to a query string
// Example: {name: 'John', age: '30', city: 'NYC'} -> 'name=John&age=30&city=NYC'
export function objectToQueryString(obj) {
  // Your code here
}

// TODO: Parse query string to object (if multiple values for same key, use array)
// Example: 'name=John&age=30&tag=js&tag=node'
//          -> {name: 'John', age: '30', tag: ['js', 'node']}
export function queryStringToObject(queryString) {
  // Your code here
}

// Tests
describe('Exercise 198: URLSearchParams', () => {
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

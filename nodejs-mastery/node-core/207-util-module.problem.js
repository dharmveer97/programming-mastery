import { describe, it, expect } from 'vitest';
import util from 'util';
import { readFile } from 'fs';

/**
 * Exercise 207: Util Module - Utilities and Helpers
 *
 * The util module provides utility functions that are useful for debugging
 * and working with functions, especially for converting between callbacks and promises.
 *
 * Key methods:
 * - util.promisify() - converts callback-based function to promise-based
 * - util.callbackify() - converts promise-based function to callback-based
 * - util.inspect() - returns string representation of object (for debugging)
 * - util.format() - returns formatted string using printf-like format
 * - util.types - provides type checking utilities
 *
 * Task: Work with util module functions
 */

// TODO: Convert callback-based readFile to promise-based
// Use util.promisify to convert fs.readFile
// Return the promisified version
export function createPromiseReadFile() {
  // Your code here
}

// TODO: Use promisified readFile to read a file
// Read the file at the given path and return its contents as a string (utf-8)
export async function readFileAsync(filePath) {
  // Your code here
}

// TODO: Convert promise function to callback-based
// Take an async function that returns a promise
// Use util.callbackify to convert it to callback-based function
// Return the callbackified version
export function convertToCallback(asyncFn) {
  // Your code here
}

// TODO: Inspect an object with custom options
// Use util.inspect to return string representation
// Options: { colors: false, depth: 2, compact: false }
export function inspectObject(obj) {
  // Your code here
}

// TODO: Inspect with color and limited depth
// Use util.inspect with options: { colors: true, depth: 1 }
// Note: This is for demonstration - in tests we'll check structure
export function inspectWithColors(obj) {
  // Your code here
}

// TODO: Format string with values
// Use util.format to create formatted string
// Example: util.format('Hello %s, you are %d years old', 'John', 25)
// -> 'Hello John, you are 25 years old'
export function formatString(template, ...values) {
  // Your code here
}

// TODO: Check if value is a Promise
// Use util.types.isPromise to check if the value is a Promise
export function isPromise(value) {
  // Your code here
}

// TODO: Create a custom promisified function with error handling
// Promisify a callback function and add error handling
// If promisified function rejects, catch error and return null
export async function safePromisify(callbackFn, ...args) {
  // Your code here
}

// Helper function for testing callbackify
export async function exampleAsyncFunction(x) {
  return x * 2;
}

// Tests
describe('Exercise 207: Util Module', () => {
  it('should create promisified readFile', () => {
    const promiseReadFile = createPromiseReadFile();
    expect(typeof promiseReadFile).toBe('function');
    // Should return a promise
    const result = promiseReadFile(__filename);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should read file using promise', async () => {
    const content = await readFileAsync(__filename);
    expect(typeof content).toBe('string');
    expect(content).toContain('Exercise 207');
  });

  it('should convert async function to callback', (done) => {
    const callbackFn = convertToCallback(exampleAsyncFunction);
    expect(typeof callbackFn).toBe('function');

    callbackFn(5, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBe(10);
      done();
    });
  });

  it('should inspect object', () => {
    const obj = {
      name: 'John',
      age: 30,
      address: {
        city: 'New York',
        nested: {
          deep: 'value'
        }
      }
    };

    const inspected = inspectObject(obj);
    expect(typeof inspected).toBe('string');
    expect(inspected).toContain('name');
    expect(inspected).toContain('John');
    expect(inspected).toContain('city');
    // Should show depth 2
    expect(inspected).toContain('nested');
  });

  it('should inspect with colors and depth', () => {
    const obj = {
      level1: {
        level2: {
          level3: 'deep'
        }
      }
    };

    const inspected = inspectWithColors(obj);
    expect(typeof inspected).toBe('string');
    expect(inspected).toContain('level1');
    expect(inspected).toContain('level2');
    // Depth 1 means level3 should show as [Object]
    expect(inspected).toContain('[Object]');
  });

  it('should format string', () => {
    const result = formatString('Hello %s, you are %d years old', 'Alice', 25);
    expect(result).toBe('Hello Alice, you are 25 years old');

    const result2 = formatString('Value: %j', { key: 'value' });
    expect(result2).toContain('"key"');
    expect(result2).toContain('"value"');
  });

  it('should check if value is a Promise', () => {
    expect(isPromise(Promise.resolve(1))).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise(42)).toBe(false);
    expect(isPromise('string')).toBe(false);
    expect(isPromise({ then: () => {} })).toBe(false);
  });

  it('should safely promisify with error handling', async () => {
    // Create a callback function that succeeds
    const successCb = (callback) => {
      callback(null, 'success');
    };

    const result1 = await safePromisify(successCb);
    expect(result1).toBe('success');

    // Create a callback function that fails
    const errorCb = (callback) => {
      callback(new Error('failed'));
    };

    const result2 = await safePromisify(errorCb);
    expect(result2).toBeNull();
  });
});

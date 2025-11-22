import { describe, it, expect } from 'vitest';
import util from 'util';
import { readFile } from 'fs';

/**
 * Exercise 207: Util Module - Utilities and Helpers - SOLUTION
 */

export function createPromiseReadFile() {
  return util.promisify(readFile);
}

export async function readFileAsync(filePath) {
  const promiseReadFile = util.promisify(readFile);
  const content = await promiseReadFile(filePath, 'utf-8');
  return content;
}

export function convertToCallback(asyncFn) {
  return util.callbackify(asyncFn);
}

export function inspectObject(obj) {
  return util.inspect(obj, { colors: false, depth: 2, compact: false });
}

export function inspectWithColors(obj) {
  return util.inspect(obj, { colors: true, depth: 1 });
}

export function formatString(template, ...values) {
  return util.format(template, ...values);
}

export function isPromise(value) {
  return util.types.isPromise(value);
}

export async function safePromisify(callbackFn, ...args) {
  try {
    const promisified = util.promisify(callbackFn);
    return await promisified(...args);
  } catch (error) {
    return null;
  }
}

export async function exampleAsyncFunction(x) {
  return x * 2;
}

// Tests
describe('Exercise 207: Util Module - Solution', () => {
  it('should create promisified readFile', () => {
    const promiseReadFile = createPromiseReadFile();
    expect(typeof promiseReadFile).toBe('function');
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
    const successCb = (callback) => {
      callback(null, 'success');
    };

    const result1 = await safePromisify(successCb);
    expect(result1).toBe('success');

    const errorCb = (callback) => {
      callback(new Error('failed'));
    };

    const result2 = await safePromisify(errorCb);
    expect(result2).toBeNull();
  });
});

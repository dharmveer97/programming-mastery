import { describe, it, expect } from 'vitest';
import assert from 'assert';

/**
 * Exercise 208: Assert Module - Testing and Validation - SOLUTION
 */

export function validatePositiveNumber(value) {
  assert(typeof value === 'number' && value > 0, 'Value must be a positive number');
}

export function validateUser(obj, expectedName, expectedAge) {
  assert.strictEqual(obj.name, expectedName);
  assert.strictEqual(obj.age, expectedAge);
}

export function assertObjectsEqual(obj1, obj2) {
  assert.deepStrictEqual(obj1, obj2);
  return true;
}

export function validateArray(actual, expected) {
  assert.deepStrictEqual(actual, expected);
}

export function assertThrowsError(fn) {
  let error;
  assert.throws(fn, (err) => {
    error = err;
    return true;
  });
  return error.message;
}

export function assertWithMessage(actual, expected, message) {
  assert.strictEqual(actual, expected, message);
}

export function validateRange(value, min, max) {
  assert(typeof value === 'number', 'Value must be a number');
  assert(value > min, `Value must be greater than ${min}`);
  assert(value < max, `Value must be less than ${max}`);
}

export function assertNotEqual(actual, expected) {
  assert.notStrictEqual(actual, expected);
}

// Tests
describe('Exercise 208: Assert Module - Solution', () => {
  it('should validate positive numbers', () => {
    expect(() => validatePositiveNumber(5)).not.toThrow();
    expect(() => validatePositiveNumber(0)).toThrow();
    expect(() => validatePositiveNumber(-5)).toThrow();

    try {
      validatePositiveNumber(-5);
    } catch (err) {
      expect(err.message).toContain('positive');
    }
  });

  it('should validate user object', () => {
    const user = { name: 'Alice', age: 30 };
    expect(() => validateUser(user, 'Alice', 30)).not.toThrow();
    expect(() => validateUser(user, 'Bob', 30)).toThrow();
    expect(() => validateUser(user, 'Alice', 25)).toThrow();
  });

  it('should assert objects are equal', () => {
    const obj1 = { name: 'John', age: 25, hobbies: ['reading'] };
    const obj2 = { name: 'John', age: 25, hobbies: ['reading'] };
    const obj3 = { name: 'John', age: 30, hobbies: ['reading'] };

    expect(assertObjectsEqual(obj1, obj2)).toBe(true);
    expect(() => assertObjectsEqual(obj1, obj3)).toThrow();
  });

  it('should validate arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];

    expect(() => validateArray(arr1, arr2)).not.toThrow();
    expect(() => validateArray(arr1, arr3)).toThrow();
  });

  it('should assert function throws', () => {
    const throwingFn = () => {
      throw new Error('Test error');
    };

    const message = assertThrowsError(throwingFn);
    expect(message).toBe('Test error');
  });

  it('should assert with custom message', () => {
    expect(() => assertWithMessage(5, 5, 'Values should match')).not.toThrow();

    try {
      assertWithMessage(5, 10, 'Custom error message');
    } catch (err) {
      expect(err.message).toContain('Custom error message');
    }
  });

  it('should validate range', () => {
    expect(() => validateRange(5, 0, 10)).not.toThrow();
    expect(() => validateRange(0, 0, 10)).toThrow();
    expect(() => validateRange(10, 0, 10)).toThrow();
    expect(() => validateRange('5', 0, 10)).toThrow();

    try {
      validateRange('not a number', 0, 10);
    } catch (err) {
      expect(err.message).toContain('number');
    }
  });

  it('should assert not equal', () => {
    expect(() => assertNotEqual(5, 10)).not.toThrow();
    expect(() => assertNotEqual('hello', 'world')).not.toThrow();
    expect(() => assertNotEqual(5, 5)).toThrow();
    expect(() => assertNotEqual('same', 'same')).toThrow();
  });
});

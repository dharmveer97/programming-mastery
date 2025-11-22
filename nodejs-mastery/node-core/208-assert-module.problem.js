import { describe, it, expect } from 'vitest';
import assert from 'assert';

/**
 * Exercise 208: Assert Module - Testing and Validation
 *
 * The assert module provides assertion functions for verifying invariants.
 * It's commonly used for testing and validation in Node.js applications.
 *
 * Key methods:
 * - assert(value, message) - tests if value is truthy
 * - assert.equal(actual, expected) - tests shallow equality (==)
 * - assert.strictEqual(actual, expected) - tests strict equality (===)
 * - assert.deepEqual(actual, expected) - tests deep equality
 * - assert.notEqual() / assert.notStrictEqual() - opposite of equal
 * - assert.throws(fn) - expects function to throw an error
 * - assert.doesNotThrow(fn) - expects function not to throw
 *
 * Task: Use assert module for testing and validation
 */

// TODO: Create a validation function using assert
// Should throw AssertionError if value is not a positive number
// Use assert() with a meaningful message
export function validatePositiveNumber(value) {
  // Your code here
}

// TODO: Validate object properties using strictEqual
// Check that obj.name is strictly equal to expectedName
// Check that obj.age is strictly equal to expectedAge
// Should throw if either check fails
export function validateUser(obj, expectedName, expectedAge) {
  // Your code here
}

// TODO: Deep equality check for objects
// Use assert.deepStrictEqual to compare two objects
// Return true if equal, throw AssertionError if not
export function assertObjectsEqual(obj1, obj2) {
  // Your code here
  return true;
}

// TODO: Validate array contents
// Use assert.deepStrictEqual to check if array matches expected
// Should throw if arrays are not deeply equal
export function validateArray(actual, expected) {
  // Your code here
}

// TODO: Assert that function throws an error
// Use assert.throws to verify that fn throws an error
// Return the error message that was thrown
export function assertThrowsError(fn) {
  // Your code here
}

// TODO: Assert with custom error message
// Use assert.strictEqual with a custom message
// If assertion fails, the custom message should be in the error
export function assertWithMessage(actual, expected, message) {
  // Your code here
}

// TODO: Validate multiple conditions
// Check all conditions are true:
// - value is a number
// - value is greater than min
// - value is less than max
// Use assert() for each check with descriptive messages
export function validateRange(value, min, max) {
  // Your code here
}

// TODO: Assert inequality
// Use assert.notStrictEqual to verify actual !== expected
// Throw if they are equal
export function assertNotEqual(actual, expected) {
  // Your code here
}

// Tests
describe('Exercise 208: Assert Module', () => {
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
    expect(() => validateRange(0, 0, 10)).toThrow(); // Not greater than min
    expect(() => validateRange(10, 0, 10)).toThrow(); // Not less than max
    expect(() => validateRange('5', 0, 10)).toThrow(); // Not a number

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

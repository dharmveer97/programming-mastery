import { describe, it, expect } from 'vitest';

/**
 * Exercise 255: Error Handling - Error Types
 *
 * Node.js has several types of errors:
 *
 * 1. System Errors (from OS):
 *    - EACCES: Permission denied
 *    - EADDRINUSE: Address already in use
 *    - ECONNRESET: Connection reset
 *    - EEXIST: File exists
 *    - ENOENT: No such file or directory
 *    - ETIMEDOUT: Operation timed out
 *
 * 2. JavaScript Errors:
 *    - Error: Generic error
 *    - TypeError: Wrong type
 *    - ReferenceError: Variable not found
 *    - SyntaxError: Invalid syntax
 *    - RangeError: Value out of range
 *    - URIError: Invalid URI
 *
 * 3. User-Specified Errors:
 *    - Custom error classes
 *    - Business logic errors
 *
 * Task: Handle different error types correctly
 */

// TODO: Create custom error class
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
  }
}

// TODO: Handle system errors
export function handleFileError(error) {
  // Your code here
  // Return appropriate error message based on error code

  if (error.code === 'ENOENT') {
    return 'File not found';
  } else if (error.code === 'EACCES') {
    return 'Permission denied';
  } else if (error.code === 'EEXIST') {
    return 'File already exists';
  }

  return 'Unknown error';
}

// TODO: Validate and throw custom errors
export function validateUser(user) {
  // Your code here
  // Throw ValidationError if user is invalid

  if (!user) {
    throw new ValidationError('User is required');
  }

  if (!user.email) {
    throw new ValidationError('Email is required');
  }

  if (!user.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }

  return true;
}

// Tests
describe('Exercise 255: Error Types', () => {
  it('should identify system errors', () => {
    const errors = [
      { code: 'ENOENT' },
      { code: 'EACCES' },
      { code: 'EEXIST' }
    ];

    expect(handleFileError(errors[0])).toBe('File not found');
    expect(handleFileError(errors[1])).toBe('Permission denied');
    expect(handleFileError(errors[2])).toBe('File already exists');
  });

  it('should throw custom errors', () => {
    expect(() => validateUser(null)).toThrow(ValidationError);
    expect(() => validateUser({})).toThrow('Email is required');
    expect(() => validateUser({ email: 'invalid' })).toThrow('Invalid email format');
  });

  it('should handle JavaScript errors', () => {
    expect(() => {
      throw new TypeError('Expected string');
    }).toThrow(TypeError);

    expect(() => {
      throw new ReferenceError('Variable not defined');
    }).toThrow(ReferenceError);
  });
});

/**
 * ERROR HANDLING BEST PRACTICES:
 *
 * 1. Always use Error objects:
 *    throw new Error('message') ✅
 *    throw 'message' ❌
 *
 * 2. Add context to errors:
 *    error.code = 'USER_NOT_FOUND'
 *    error.statusCode = 404
 *
 * 3. Create custom error classes:
 *    class NotFoundError extends Error {}
 *
 * 4. Handle errors at appropriate level
 * 5. Log errors with stack traces
 * 6. Don't swallow errors silently
 */

import { describe, it, expect } from 'vitest';

/**
 * Exercise 256: Uncaught Exceptions & Stack Traces
 *
 * Uncaught Exceptions:
 * - Errors that aren't caught by try/catch
 * - Can crash your application
 * - Should be handled at process level
 *
 * Stack Trace:
 * - Shows the call stack when error occurred
 * - Essential for debugging
 * - Includes file names and line numbers
 *
 * Handling Uncaught Exceptions:
 * process.on('uncaughtException', (error) => {
 *   console.error('Uncaught Exception:', error);
 *   process.exit(1); // Exit gracefully
 * });
 *
 * Unhandled Promise Rejections:
 * process.on('unhandledRejection', (reason, promise) => {
 *   console.error('Unhandled Rejection:', reason);
 * });
 *
 * Task: Handle uncaught errors properly
 */

// TODO: Extract info from stack trace
export function parseStackTrace(error) {
  // Your code here
  // Return { message, stack, firstLine }

  const stack = error.stack || '';
  const lines = stack.split('\n');

  return {
    message: error.message,
    stack: stack,
    firstLine: lines[1]?.trim() || ''
  };
}

// TODO: Create detailed error with stack
export function createDetailedError(message, context = {}) {
  const error = new Error(message);

  // Add context
  Object.assign(error, context);

  return error;
}

// TODO: Safe async function execution
export async function safeAsyncExecute(fn) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error in async function:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

// Tests
describe('Exercise 256: Uncaught Exceptions', () => {
  it('should parse stack trace', () => {
    const error = new Error('Test error');
    const parsed = parseStackTrace(error);

    expect(parsed.message).toBe('Test error');
    expect(parsed.stack).toContain('Test error');
    expect(parsed.firstLine).toContain('at');
  });

  it('should create detailed error', () => {
    const error = createDetailedError('User not found', {
      code: 'USER_NOT_FOUND',
      userId: 123,
      statusCode: 404
    });

    expect(error.message).toBe('User not found');
    expect(error.code).toBe('USER_NOT_FOUND');
    expect(error.userId).toBe(123);
    expect(error.stack).toBeTruthy();
  });

  it('should handle async errors', async () => {
    const failingFunction = async () => {
      throw new Error('Async error');
    };

    await expect(safeAsyncExecute(failingFunction)).rejects.toThrow('Async error');
  });
});

/**
 * PRODUCTION ERROR HANDLING:
 *
 * 1. Global Exception Handler:
 * process.on('uncaughtException', (error) => {
 *   logger.error('Uncaught Exception:', error);
 *   // Cleanup and exit
 *   process.exit(1);
 * });
 *
 * 2. Unhandled Rejection Handler:
 * process.on('unhandledRejection', (reason, promise) => {
 *   logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
 *   // In Node.js 15+, this will terminate by default
 * });
 *
 * 3. Graceful Shutdown:
 * process.on('SIGTERM', () => {
 *   server.close(() => {
 *     console.log('Process terminated');
 *   });
 * });
 *
 * 4. Error Monitoring:
 * - Use Sentry, Rollbar, or similar
 * - Log with Winston/Bunyan
 * - Track error rates
 * - Set up alerts
 */

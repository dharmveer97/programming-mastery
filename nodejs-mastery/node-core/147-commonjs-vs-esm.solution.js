import { describe, it, expect } from 'vitest';

/**
 * Exercise 147: CommonJS vs ES Modules - SOLUTION
 */

// Named exports (ESM)
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

// Default export (ESM)
export default function greet(name) {
  return `Hello, ${name}!`;
}

// Additional examples:

// Multiple named exports
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

// Export object
export const math = {
  add,
  multiply,
  divide
};

// Tests
describe('Exercise 147: CommonJS vs ESM - Solution', () => {
  it('should export named function (ESM)', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should export constant (ESM)', () => {
    expect(PI).toBe(3.14159);
  });

  it('should export default (ESM)', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
  });

  it('should work with multiple exports', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(divide(10, 2)).toBe(5);
  });
});

/**
 * REAL-WORLD EXAMPLES:
 *
 * ESM (Modern):
 * -------------
 * // utils.js
 * export const formatDate = (date) => date.toISOString();
 * export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
 * export default function processData(data) { ... }
 *
 * // main.js
 * import processData, { formatDate, validateEmail } from './utils.js';
 *
 * CommonJS (Legacy):
 * ------------------
 * // utils.js
 * const formatDate = (date) => date.toISOString();
 * const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
 * function processData(data) { ... }
 * module.exports = { formatDate, validateEmail, processData };
 *
 * // main.js
 * const { formatDate, validateEmail, processData } = require('./utils');
 *
 * MIGRATION TIP:
 * - Add "type": "module" to package.json
 * - Change require() to import
 * - Change module.exports to export
 * - Add .js extensions to imports
 * - Use await at top level if needed
 */
